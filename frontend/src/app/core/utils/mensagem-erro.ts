import { HttpErrorResponse } from '@angular/common/http';

/**
 * Transforma o erro devolvido pela API (ErrorResponse do Spring)
 * em uma mensagem amigável para exibir na tela.
 */
export function mensagemErro(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return 'Algo deu errado. Tente de novo.';

  const corpo = (err.error && typeof err.error === 'object' ? err.error : null) as
    | { erro?: string; campos?: Record<string, string> }
    | null;

  // Sem resposta da API: backend parado ou rede fora do ar.
  // (status 0 = sem conexão; 5xx sem o JSON de erro = o proxy não conseguiu chegar no backend)
  if (err.status === 0 || (err.status >= 500 && !corpo?.erro)) {
    return 'Sem conexão com o servidor. Confira se o backend está rodando e tente de novo.';
  }

  const campos = Object.values(corpo?.campos ?? {});
  const principal = corpo?.erro ?? `Não foi possível concluir (erro ${err.status}).`;
  return campos.length ? `${principal} ${campos.join('; ')}.` : principal;
}
