export type Perfil = 'ADMINISTRADOR' | 'PORTEIRO';

export const PERFIL_LABEL: Record<Perfil, string> = {
  ADMINISTRADOR: 'Administrador',
  PORTEIRO: 'Porteiro',
};

export interface FuncionarioRequest {
  nome: string;
  usuario: string;
  senha: string | null;  // obrigatória no cadastro; null na edição = manter a senha atual
  perfil: Perfil;
}

// A API nunca devolve a senha
export interface FuncionarioResponse {
  id: number;
  nome: string;
  usuario: string;
  perfil: Perfil;
}

export interface LoginRequest {
  usuario: string;
  senha: string;
}

export interface UsuarioLogado {
  id: number;
  nome: string;
  perfil: Perfil;
  /** Enviado em toda chamada à API (Authorization: Bearer ...) */
  token: string;
}
