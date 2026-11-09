export interface MoradorRequest {
  nome: string;
  unidade: string;
  cpf: string;
}

export interface MoradorResponse extends MoradorRequest {
  id: number;
}
