export type TipoVeiculo = 'VISITANTE' | 'INSTITUICAO' | 'OUTRO';

export const TIPO_VEICULO_LABEL: Record<TipoVeiculo, string> = {
  VISITANTE: 'Visitante',
  INSTITUICAO: 'Instituição (do Lar)',
  OUTRO: 'Outro (fornecedor, doador...)',
};

export interface PessoaResumo {
  id: number;
  nome: string;
}

export interface VeiculoRequest {
  placa: string;
  marca: string;
  modelo: string;
  cor: string;
  tipo: TipoVeiculo;
  responsavel: string | null;  // quando não é de visitante
  pessoaIds: number[];         // quando é de visitante (uma ou mais pessoas)
}

export interface VeiculoResponse {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  cor: string;
  tipo: TipoVeiculo;
  responsavel: string | null;
  pessoas: PessoaResumo[];
}

/** "FJK2B31 - Fiat Uno (Prata)" */
export function descricaoVeiculo(v: VeiculoResponse): string {
  return `${v.placa} - ${v.marca} ${v.modelo} (${v.cor})`;
}
