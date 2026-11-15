import { Component, ElementRef, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, finalize } from 'rxjs';

import { MoradorResponse, VINCULO_LABEL, VinculoVisitante, VisitanteResponse } from '../../core/models';
import { AvisosService } from '../../core/services/avisos.service';
import { ConfirmacaoService } from '../../core/services/confirmacao.service';
import { MoradorService } from '../../core/services/morador.service';
import { VisitanteService } from '../../core/services/visitante.service';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { contem } from '../../core/utils/texto';
import { CPF_REGEX, TELEFONE_REGEX } from '../../core/utils/validadores';
import { ErroCampo } from '../../shared/components/erro-campo/erro-campo';
import { Icone } from '../../shared/components/icone/icone';
import { OpcaoSelecao, SelecaoMultipla } from '../../shared/components/selecao-multipla/selecao-multipla';
import { Mascara } from '../../shared/directives/mascara';

// RF02 - Cadastro de visitantes (parente, cuidador ou amigo de um ou mais moradores)
@Component({
  selector: 'app-visitantes',
  imports: [ReactiveFormsModule, ErroCampo, SelecaoMultipla, Mascara, Icone],
  templateUrl: './visitantes.html',
})
export class Visitantes implements OnInit {
  private service = inject(VisitanteService);
  private moradorService = inject(MoradorService);
  private avisos = inject(AvisosService);
  private confirmacao = inject(ConfirmacaoService);
  private fb = inject(FormBuilder);

  private painelFormulario = viewChild.required<ElementRef<HTMLElement>>('painelFormulario');

  protected readonly vinculoLabel = VINCULO_LABEL;
  protected readonly vinculos = Object.keys(VINCULO_LABEL) as VinculoVisitante[];

  visitantes = signal<VisitanteResponse[]>([]);
  moradores = signal<MoradorResponse[]>([]);
  carregando = signal(true);
  salvando = signal(false);
  editandoId = signal<number | null>(null);
  erro = signal('');

  // Busca na tabela (nome, CPF, telefone ou morador visitado)
  filtro = signal('');
  filtrados = computed(() =>
    this.visitantes().filter((v) => contem(this.filtro(), v.nome, v.documento, v.telefone, this.nomesMoradores(v))),
  );

  // Moradores em formato de opção para as caixas de seleção
  opcoesMoradores = computed<OpcaoSelecao[]>(() =>
    this.moradores().map((m) => ({ id: m.id, rotulo: m.nome, detalhe: m.unidade })),
  );

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    documento: ['', [Validators.required, Validators.pattern(CPF_REGEX)]],
    telefone: ['', [Validators.required, Validators.pattern(TELEFONE_REGEX)]],
    vinculo: ['FAMILIAR' as VinculoVisitante, Validators.required],
    moradorIds: [[] as number[], Validators.required],
  });

  ngOnInit(): void {
    this.moradorService.getAll().subscribe({
      next: (lista) => this.moradores.set(lista),
      error: (e) => this.erro.set(mensagemErro(e)),
    });
    this.carregar();
  }

  carregar(): void {
    this.service
      .getAll()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (lista) => this.visitantes.set(lista),
        error: (e) => this.erro.set(mensagemErro(e)),
      });
  }

  nomesMoradores(v: VisitanteResponse): string {
    return v.moradores.map((m) => m.nome).join(', ');
  }

  salvar(): void {
    if (this.salvando()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados = this.form.getRawValue();
    const id = this.editandoId();
    const requisicao: Observable<unknown> = id ? this.service.update(id, dados) : this.service.save(dados);

    this.salvando.set(true);
    requisicao.pipe(finalize(() => this.salvando.set(false))).subscribe({
      next: () => {
        this.avisos.sucesso(id ? `Cadastro de ${dados.nome} atualizado.` : `Cadastro de ${dados.nome} criado.`);
        this.cancelar();
        this.carregar();
      },
      error: (e) => this.erro.set(mensagemErro(e)),
    });
  }

  editar(v: VisitanteResponse): void {
    this.editandoId.set(v.id);
    this.erro.set('');
    this.form.setValue({
      nome: v.nome,
      documento: v.documento,
      telefone: v.telefone,
      vinculo: v.vinculo,
      moradorIds: v.moradores.map((m) => m.id),
    });
    this.irParaOFormulario();
  }

  async excluir(v: VisitanteResponse): Promise<void> {
    const confirmou = await this.confirmacao.perguntar({
      titulo: `Excluir o cadastro de ${v.nome}?`,
      texto: 'O visitante será apagado do sistema e não dá para desfazer.',
      confirmar: 'Excluir',
      perigo: true,
    });
    if (!confirmou) return;

    this.service.delete(v.id).subscribe({
      next: () => {
        this.avisos.sucesso(`Cadastro de ${v.nome} excluído.`);
        if (this.editandoId() === v.id) this.cancelar();
        this.carregar();
      },
      error: (e) => this.avisos.erro(mensagemErro(e)),
    });
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.erro.set('');
    this.form.reset();
  }

  /** O formulário fica no topo: ao editar uma linha lá de baixo, a tela sobe até ele e o cursor vai para o nome. */
  private irParaOFormulario(): void {
    const painel = this.painelFormulario().nativeElement;
    painel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    painel.querySelector<HTMLElement>('input')?.focus({ preventScroll: true });
  }
}
