import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { mensagemErro } from '../../core/utils/mensagem-erro';

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

  erro = signal('');
  carregando = signal(false);

  form = this.fb.nonNullable.group({
    usuario: ['', Validators.required],
    senha: ['', Validators.required],
  });

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.erro.set('Preencha usuário e senha.');
      return;
    }
    this.carregando.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/entrada-saida']),
      error: (e) => {
        this.erro.set(mensagemErro(e));
        this.carregando.set(false);
      },
    });
  }
}
