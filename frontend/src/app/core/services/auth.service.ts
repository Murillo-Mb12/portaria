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

  /** Sair: avisa o servidor (o token deixa de valer) e limpa a sessão do navegador. */
  logout(): void {
    const token = this.usuario()?.token;
    if (token) {
      this.http
        .post(`${environment.apiUrl}/logout`, null, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe({ error: () => undefined }); // se o servidor não responder, a sessão expira sozinha
    }
    this.encerrarLocal();
  }

  /** Limpa a sessão só no navegador (usado quando o servidor diz que ela expirou). */
  encerrarLocal(): void {
    sessionStorage.removeItem(CHAVE_SESSAO);
    this.usuario.set(null);
  }

  private lerSessao(): UsuarioLogado | null {
    try {
      const salvo = sessionStorage.getItem(CHAVE_SESSAO);
      const usuario = salvo ? (JSON.parse(salvo) as UsuarioLogado) : null;
      // Sessão salva por uma versão antiga do sistema (sem token): pede login de novo
      return usuario?.token ? usuario : null;
    } catch {
      return null;
    }
  }
}
