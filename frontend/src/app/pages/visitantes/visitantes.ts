import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { MoradorResponse, VINCULO_LABEL, VinculoVisitante, VisitanteResponse } from '../../core/models';
import { MoradorService } from '../../core/services/morador.service';
import { VisitanteService } from '../../core/services/visitante.service';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { TELEFONE_REGEX } from '../../core/utils/validadores';
import { ErroCampo } from '../../shared/components/erro-campo/erro-campo';
import { OpcaoSelecao, SelecaoMultipla } from '../../shared/components/selecao-multipla/selecao-multipla';

// RF02 - Cadastro de visitantes (parente, cuidador ou amigo de um ou mais moradores)
@Component({
  selector: 'app-visitantes',
  imports: [ReactiveFormsModule, ErroCampo, SelecaoMultipla],
  templateUrl: './visitantes.html',
})
export class Visitantes implements OnInit {
  private service = inject(VisitanteService);
  private moradorService = inject(MoradorService);
  private fb = inject(FormBuilder);

  protected readonly vinculoLabel = VINCULO_LABEL;
  protected readonly vinculos = Object.keys(VINCULO_LABEL) as VinculoVisitante[];

  visitantes = signal<VisitanteResponse[]>([]);
  moradores = signal<MoradorResponse[]>([]);
  editandoId = signal<number | null>(null);
  mensagem = signal('');
  erro = signal('');

  // Moradores em formato de opção para as caixas de seleção
  opcoesMoradores = computed<OpcaoSelecao[]>(() =>
    this.moradores().map((m) => ({ id: m.id, rotulo: m.nome, detalhe: m.unidade })),
  );

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    documento: ['', [Validators.required, Validators.maxLength(20)]],
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
    this.service.getAll().subscribe({
      next: (lista) => this.visitantes.set(lista),
      error: (e) => this.erro.set(mensagemErro(e)),
    });
  }

  nomesMoradores(v: VisitanteResponse): string {
    return v.moradores.map((m) => m.nome).join(', ');
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados = this.form.getRawValue();
    const id = this.editandoId();
    const requisicao: Observable<unknown> = id ? this.service.update(id, dados) : this.service.save(dados);

    requisicao.subscribe({
      next: () => {
        this.sucesso(id ? 'Visitante atualizado!' : 'Visitante cadastrado!');
        this.cancelar();
        this.carregar();
      },
      error: (e) => this.falha(e),
    });
  }

  editar(v: VisitanteResponse): void {
    this.editandoId.set(v.id);
    this.form.setValue({
      nome: v.nome,
      documento: v.documento,
      telefone: v.telefone,
      vinculo: v.vinculo,
      moradorIds: v.moradores.map((m) => m.id),
    });
    this.mensagem.set('');
  }

  excluir(v: VisitanteResponse): void {
    if (!confirm(`Excluir o visitante ${v.nome}?`)) return;
    this.service.delete(v.id).subscribe({
      next: () => {
        this.sucesso('Visitante excluído.');
        if (this.editandoId() === v.id) this.cancelar();
        this.carregar();
      },
      error: (e) => this.falha(e),
    });
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.form.reset();
  }

  private sucesso(msg: string): void {
    this.mensagem.set(msg);
    this.erro.set('');
  }

  private falha(e: unknown): void {
    this.erro.set(mensagemErro(e));
    this.mensagem.set('');
  }
}
