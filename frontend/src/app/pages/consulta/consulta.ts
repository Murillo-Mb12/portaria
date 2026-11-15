import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, catchError, debounceTime, of, switchMap, tap } from 'rxjs';

import { AcessoResponse } from '../../core/models';
import { AcessoService } from '../../core/services/acesso.service';
import { dataLocal, diasAtras } from '../../core/utils/datas';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { TabelaAcessos } from '../../shared/components/tabela-acessos/tabela-acessos';

type Atalho = 'hoje' | '7dias' | '30dias' | 'tudo';

// RF10 - Consulta de acessos (o filtro é feito no backend)
@Component({
  selector: 'app-consulta',
  imports: [ReactiveFormsModule, TabelaAcessos],
  templateUrl: './consulta.html',
})
export class Consulta implements OnInit {
  private service = inject(AcessoService);
  private fb = inject(FormBuilder);

  protected readonly atalhos: { valor: Atalho; rotulo: string }[] = [
    { valor: 'hoje', rotulo: 'Hoje' },
    { valor: '7dias', rotulo: '7 dias' },
    { valor: '30dias', rotulo: '30 dias' },
    { valor: 'tudo', rotulo: 'Tudo' },
  ];

  acessos = signal<AcessoResponse[]>([]);
  carregando = signal(true);
  erro = signal('');
  /** Atalho de período marcado; null quando as datas foram escolhidas à mão */
  atalho = signal<Atalho | null>('7dias');

  // Abre mostrando a última semana (o histórico completo pode ser grande)
  filtro = this.fb.nonNullable.group({
    busca: [''],
    de: [diasAtras(6)],
    ate: [dataLocal()],
  });

  // Cada pedido de busca passa por aqui; o switchMap descarta a resposta de um pedido antigo
  // se a pessoa já mudou o filtro (a tabela nunca mostra um resultado atrasado).
  private pedidos = new Subject<void>();

  constructor() {
    this.pedidos
      .pipe(
        tap(() => this.carregando.set(true)),
        switchMap(() =>
          this.service.getAll(this.filtro.getRawValue()).pipe(
            tap(() => this.erro.set('')),
            catchError((e) => {
              this.erro.set(mensagemErro(e));
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((lista) => {
        this.carregando.set(false);
        if (lista) this.acessos.set(lista);
      });

    // Filtra sozinho enquanto a pessoa digita ou muda as datas (espera uma pausa de 0,35 s)
    this.filtro.valueChanges.pipe(debounceTime(350), takeUntilDestroyed()).subscribe(() => this.pedidos.next());
  }

  ngOnInit(): void {
    this.pedidos.next();
  }

  /** Botões "Hoje / 7 dias / 30 dias / Tudo": preenchem as datas e já buscam. */
  usarAtalho(atalho: Atalho): void {
    const hoje = dataLocal();
    const periodo: Record<Atalho, { de: string; ate: string }> = {
      hoje: { de: hoje, ate: hoje },
      '7dias': { de: diasAtras(6), ate: hoje },
      '30dias': { de: diasAtras(29), ate: hoje },
      tudo: { de: '', ate: '' },
    };
    this.atalho.set(atalho);
    this.filtro.patchValue(periodo[atalho], { emitEvent: false });
    this.pedidos.next();
  }

  /** Datas mudadas à mão: nenhum atalho fica marcado. */
  aoMudarData(): void {
    this.atalho.set(null);
  }

  limpar(): void {
    this.filtro.controls.busca.setValue('', { emitEvent: false });
    this.usarAtalho('7dias');
  }
}
