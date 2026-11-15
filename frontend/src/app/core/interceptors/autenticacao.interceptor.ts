import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * Coloca o token do login em toda chamada à API.
 * Se o servidor responder 401 (sessão expirada, servidor reiniciado, usuário excluído),
 * limpa a sessão e volta para a tela de login com o aviso.
 */
export const autenticacaoInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const ehApi = req.url.startsWith(environment.apiUrl);
  const ehLogin = req.url === `${environment.apiUrl}/login` || req.url === `${environment.apiUrl}/logout`;

  const token = auth.usuario()?.token;
  const pedido = ehApi && !ehLogin && token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(pedido).pipe(
    catchError((erro: unknown) => {
      if (ehApi && !ehLogin && erro instanceof HttpErrorResponse && erro.status === 401 && auth.logado()) {
        auth.encerrarLocal();
        router.navigate(['/login'], { queryParams: { sessao: 'expirada' } });
      }
      return throwError(() => erro);
    }),
  );
};
