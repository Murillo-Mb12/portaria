import { Component, ElementRef, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, finalize } from 'rxjs';

import { MoradorResponse } from '../../core/models';
import { AvisosService } from '../../core/services/avisos.service';
import { ConfirmacaoService } from '../../core/services/confirmacao.service';
import { MoradorService } from '../../core/services/morador.service';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { contem } from '../../core/utils/texto';
import { CPF_REGEX } from '../../core/utils/validadores';
import { ErroCampo } from '../../shared/components/erro-campo/erro-campo';
import { Icone } from '../../shared/components/icone/icone';
import { Mascara } from '../../shared/directives/mascara';

// RF03 - Cadastro de moradores (CRUD)
@Component({
  selector: 'app-moradores',
  imports: [ReactiveFormsModule, ErroCampo, Mascara, Icone],
  templateUrl: './moradores.html',
})
export class Moradores implements OnInit {
  private service = inject(MoradorService);
  private avisos = inject(AvisosService);
  private confirmacao = inject(ConfirmacaoService);
  private fb = inject(FormBuilder);

  private painelFormulario = viewChild.required<ElementRef<HTMLElement>>('painelFormulario');

  moradores = signal<MoradorResponse[]>([]);
  carregando = signal(true);
  salvando = signal(false);
  editandoId = signal<number | null>(null);
  erro = signal('');

  // Busca na tabela (nome, unidade ou CPF)
  filtro = signal('');
  filtrados = computed(() => this.moradores().filter((m) => contem(this.filtro(), m.nome, m.unidade, m.cpf)));

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    unidade: ['', [Validators.required, Validators.maxLength(50)]],
    cpf: ['', [Validators.required, Validators.pattern(CPF_REGEX)]],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service
      .getAll()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (lista) => this.moradores.set(lista),
        error: (e) => this.erro.set(mensagemErro(e)),
      });
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

  editar(m: MoradorResponse): void {
    this.editandoId.set(m.id);
    this.erro.set('');
    this.form.setValue({ nome: m.nome, unidade: m.unidade, cpf: m.cpf ?? '' });
    this.irParaOFormulario();
  }

  async excluir(m: MoradorResponse): Promise<void> {
    const confirmou = await this.confirmacao.perguntar({
      titulo: `Excluir o cadastro de ${m.nome}?`,
      texto: 'O morador será apagado do sistema e não dá para desfazer.',
      confirmar: 'Excluir',
      perigo: true,
    });
    if (!confirmou) return;

    this.service.delete(m.id).subscribe({
      next: () => {
        this.avisos.sucesso(`Cadastro de ${m.nome} excluído.`);
        if (this.editandoId() === m.id) this.cancelar();
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
