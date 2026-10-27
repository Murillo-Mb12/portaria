import { HttpErrorResponse } from '@angular/common/http';

/**
 * Transforma o erro devolvido pela API (ErrorResponse do Spring)
 * em uma mensagem amigável para exibir na tela.
 */
export function mensagemErro(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return 'Erro inesperado.';
  if (err.status === 0) return 'Não foi possível conectar à API. O backend está rodando na porta 8080?';

  const corpo = err.error as { erro?: string; campos?: Record<string, string> } | null;
  const campos = Object.values(corpo?.campos ?? {});
  const principal = corpo?.erro ?? `Erro ${err.status}`;
  return campos.length ? `${principal} ${campos.join('; ')}.` : principal;
}
