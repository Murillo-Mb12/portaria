export interface MoradorRequest {
  nome: string;
  unidade: string;
  telefone: string;
}

export interface MoradorResponse extends MoradorRequest {
  id: number;
}
