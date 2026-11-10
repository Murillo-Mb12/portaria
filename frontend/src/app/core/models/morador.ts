export interface MoradorRequest {
  nome: string;
  unidade: string;
  cpf: string;
}

export interface MoradorResponse {
  id: number;
  nome: string;
  unidade: string;
  cpf: string | null;  // moradores cadastrados antes do V4 podem estar sem CPF
}
