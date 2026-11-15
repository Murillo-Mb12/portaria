import { Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, finalize } from 'rxjs';

import { FuncionarioRequest, FuncionarioResponse, PERFIL_LABEL, Perfil } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { AvisosService } from '../../core/services/avisos.service';
import { ConfirmacaoService } from '../../core/services/confirmacao.service';
import { FuncionarioService } from '../../core/services/funcionario.service';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { ErroCampo } from '../../shared/components/erro-campo/erro-campo';

// RF05 - Cadastro de funcionários (CRUD, somente administrador)
/** Senha forte: pelo menos 8 caracteres, com letras e números (a API confere a mesma regra). */
const REGRAS_SENHA = [Validators.pattern(/^(?=.*[A-Za-zÀ-ÿ])(?=.*\d).{8,100}$/), Validators.maxLength(100)];

@Component({
  selector: 'app-funcionarios',
  imports: [ReactiveFormsModule, ErroCampo],
  templateUrl: './funcionarios.html',
})
export class Funcionarios implements OnInit {
  private service = inject(FuncionarioService);
  private avisos = inject(AvisosService);
  private confirmacao = inject(ConfirmacaoService);
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);
  private router = inject(Router);

  private painelFormulario = viewChild.required<ElementRef<HTMLElement>>('painelFormulario');

  protected readonly perfilLabel = PERFIL_LABEL;
  protected readonly perfis = Object.keys(PERFIL_LABEL) as Perfil[];

  funcionarios = signal<FuncionarioResponse[]>([]);
  carregando = signal(true);
  salvando = signal(false);
  editandoId = signal<number | null>(null);
  erro = signal('');

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    senha: ['', [Validators.required, ...REGRAS_SENHA]],
    perfil: ['PORTEIRO' as Perfil, Validators.required],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service
      .getAll()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (lista) => this.funcionarios.set(lista),
        error: (e) => this.erro.set(mensagemErro(e)),
      });
  }

  salvar(): void {
    if (this.salvando()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const f = this.form.getRawValue();
    // Senha em branco na edição = manter a atual (a API recebe null)
    const dados: FuncionarioRequest = { ...f, senha: f.senha || null };
    const id = this.editandoId();
    // Trocou a própria senha ou o próprio perfil: o servidor encerra a sessão, então é preciso entrar de novo
    const eu = this.auth.usuario();
    const mudouMeuAcesso = !!id && id === eu?.id && (!!dados.senha || dados.perfil !== eu.perfil);
    const requisicao: Observable<unknown> = id ? this.service.update(id, dados) : this.service.save(dados);

    this.salvando.set(true);
    requisicao.pipe(finalize(() => this.salvando.set(false))).subscribe({
      next: () => {
        if (mudouMeuAcesso) {
          this.auth.encerrarLocal();
          this.router.navigate(['/login'], { queryParams: { sessao: 'alterada' } });
          return;
        }
        this.avisos.sucesso(id ? `Cadastro de ${dados.nome} atualizado.` : `Cadastro de ${dados.nome} criado.`);
        this.cancelar();
        this.carregar();
      },
      error: (e) => this.erro.set(mensagemErro(e)),
    });
  }

  // A API não devolve a senha: na edição o campo fica em branco e só é enviado se for preenchido
  editar(f: FuncionarioResponse): void {
    this.editandoId.set(f.id);
    this.erro.set('');
    this.exigirSenha(false);
    this.form.setValue({ nome: f.nome, usuario: f.usuario, senha: '', perfil: f.perfil });

    const painel = this.painelFormulario().nativeElement;
    painel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    painel.querySelector<HTMLElement>('input')?.focus({ preventScroll: true });
  }

  async excluir(f: FuncionarioResponse): Promise<void> {
    const confirmou = await this.confirmacao.perguntar({
      titulo: `Excluir o cadastro de ${f.nome}?`,
      texto: `O usuário "${f.usuario}" não conseguirá mais entrar no sistema.`,
      confirmar: 'Excluir',
      perigo: true,
    });
    if (!confirmou) return;

    this.service.delete(f.id).subscribe({
      next: () => {
        this.avisos.sucesso(`Cadastro de ${f.nome} excluído.`);
        if (this.editandoId() === f.id) this.cancelar();
        this.carregar();
      },
      error: (e) => this.avisos.erro(mensagemErro(e)),
    });
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.erro.set('');
    this.exigirSenha(true);
    this.form.reset();
  }

  /** Senha obrigatória no cadastro e opcional na edição. */
  private exigirSenha(obrigatoria: boolean): void {
    this.form.controls.senha.setValidators(obrigatoria ? [Validators.required, ...REGRAS_SENHA] : REGRAS_SENHA);
    this.form.controls.senha.updateValueAndValidity();
  }
}
