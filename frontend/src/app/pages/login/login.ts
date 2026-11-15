import { Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { mensagemErro } from '../../core/utils/mensagem-erro';

/** Aviso mostrado ao voltar para o login (?sessao=...) */
const LOGIN_AVISOS: Record<string, string> = {
  expirada: 'Sua sessão expirou. Entre novamente.',
  alterada: 'Seus dados de acesso foram alterados. Entre de novo com a nova senha.',
};

// RF01 - Login
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private campoUsuario = viewChild.required<ElementRef<HTMLInputElement>>('campoUsuario');

  // Voltou para cá porque a sessão expirou (ou o servidor foi reiniciado)
  protected readonly demonstracao = environment.demonstracao;

  erro = signal(LOGIN_AVISOS[inject(ActivatedRoute).snapshot.queryParamMap.get('sessao') ?? ''] ?? '');
  carregando = signal(false);
  mostrarSenha = signal(false);

  form = this.fb.nonNullable.group({
    usuario: ['', Validators.required],
    senha: ['', Validators.required],
  });

  constructor() {
    // Já abre com o cursor no usuário (também depois de clicar em "Sair")
    afterNextRender(() => this.campoUsuario().nativeElement.focus());
  }

  entrar(): void {
    if (this.carregando()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.erro.set('Preencha o usuário e a senha.');
      return;
    }
    this.carregando.set(true);
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/entrada-saida']),
        error: (e) => {
          this.erro.set(mensagemErro(e));
          // Senha errada: limpa só a senha (o usuário digitado continua)
          this.form.controls.senha.reset();
        },
      });
  }
}
