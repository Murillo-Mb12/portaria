import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, UsuarioLogado } from '../models';

const CHAVE_SESSAO = 'portaria.usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // Usuário logado (fica salvo no sessionStorage para sobreviver ao F5)
  readonly usuario = signal<UsuarioLogado | null>(this.lerSessao());
  readonly logado = computed(() => this.usuario() !== null);
  readonly isAdmin = computed(() => this.usuario()?.perfil === 'ADMINISTRADOR');

  login(credenciais: LoginRequest): Observable<UsuarioLogado> {
    return this.http.post<UsuarioLogado>(`${environment.apiUrl}/login`, credenciais).pipe(
      tap((usuario) => {
        sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
        this.usuario.set(usuario);
      }),
    );
  }

  logout(): void {
    sessionStorage.removeItem(CHAVE_SESSAO);
    this.usuario.set(null);
  }

  private lerSessao(): UsuarioLogado | null {
    try {
      const salvo = sessionStorage.getItem(CHAVE_SESSAO);
      return salvo ? (JSON.parse(salvo) as UsuarioLogado) : null;
    } catch {
      return null;
    }
  }
}
