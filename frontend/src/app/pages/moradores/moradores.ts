import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { MoradorResponse } from '../../core/models';
import { MoradorService } from '../../core/services/morador.service';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { TELEFONE_REGEX } from '../../core/utils/validadores';
import { ErroCampo } from '../../shared/components/erro-campo/erro-campo';

// RF03 - Cadastro de moradores (CRUD)
@Component({
  selector: 'app-moradores',
  imports: [ReactiveFormsModule, ErroCampo],
  templateUrl: './moradores.html',
})
export class Moradores implements OnInit {
  private service = inject(MoradorService);
  private fb = inject(FormBuilder);

  moradores = signal<MoradorResponse[]>([]);
  editandoId = signal<number | null>(null);
  mensagem = signal('');
  erro = signal('');

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    unidade: ['', [Validators.required, Validators.maxLength(50)]],
    telefone: ['', [Validators.required, Validators.pattern(TELEFONE_REGEX)]],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.getAll().subscribe({
      next: (lista) => this.moradores.set(lista),
      error: (e) => this.erro.set(mensagemErro(e)),
    });
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
        this.sucesso(id ? 'Morador atualizado!' : 'Morador cadastrado!');
        this.cancelar();
        this.carregar();
      },
      error: (e) => this.falha(e),
    });
  }

  editar(m: MoradorResponse): void {
    this.editandoId.set(m.id);
    this.form.setValue({ nome: m.nome, unidade: m.unidade, telefone: m.telefone });
    this.mensagem.set('');
  }

  excluir(m: MoradorResponse): void {
    if (!confirm(`Excluir o morador ${m.nome}?`)) return;
    this.service.delete(m.id).subscribe({
      next: () => {
        this.sucesso('Morador excluído.');
        if (this.editandoId() === m.id) this.cancelar();
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
