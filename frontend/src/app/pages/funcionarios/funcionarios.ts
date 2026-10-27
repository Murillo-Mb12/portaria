import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { FuncionarioResponse, PERFIL_LABEL, Perfil } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { FuncionarioService } from '../../core/services/funcionario.service';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { ErroCampo } from '../../shared/components/erro-campo/erro-campo';

// RF05 - Cadastro de funcionários (CRUD, somente administrador)
@Component({
  selector: 'app-funcionarios',
  imports: [ReactiveFormsModule, ErroCampo],
  templateUrl: './funcionarios.html',
})
export class Funcionarios implements OnInit {
  private service = inject(FuncionarioService);
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);

  protected readonly perfilLabel = PERFIL_LABEL;
  protected readonly perfis = Object.keys(PERFIL_LABEL) as Perfil[];

  funcionarios = signal<FuncionarioResponse[]>([]);
  editandoId = signal<number | null>(null);
  mensagem = signal('');
  erro = signal('');

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    senha: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
    perfil: ['PORTEIRO' as Perfil, Validators.required],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.getAll().subscribe({
      next: (lista) => this.funcionarios.set(lista),
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
        this.sucesso(id ? 'Funcionário atualizado!' : 'Funcionário cadastrado!');
        this.cancelar();
        this.carregar();
      },
      error: (e) => this.falha(e),
    });
  }

  // A API não devolve a senha, então na edição é preciso digitar uma nova
  editar(f: FuncionarioResponse): void {
    this.editandoId.set(f.id);
    this.form.setValue({ nome: f.nome, usuario: f.usuario, senha: '', perfil: f.perfil });
    this.mensagem.set('');
  }

  excluir(f: FuncionarioResponse): void {
    if (!confirm(`Excluir o funcionário ${f.nome}?`)) return;
    this.service.delete(f.id).subscribe({
      next: () => {
        this.sucesso('Funcionário excluído.');
        if (this.editandoId() === f.id) this.cancelar();
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
