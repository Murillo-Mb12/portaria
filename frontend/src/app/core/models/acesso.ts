export type ObjetivoAcesso = 'VISITA' | 'DOACAO' | 'OUTROS';
export type FinalidadeAcesso = 'BAZAR' | 'IGREJA' | 'REUNIAO' | 'IMPRENSA' | 'OUTRO';

export const OBJETIVO_LABEL: Record<ObjetivoAcesso, string> = {
  VISITA: 'Visita',
  DOACAO: 'Doação',
  OUTROS: 'Outros',
};

export const FINALIDADE_LABEL: Record<FinalidadeAcesso, string> = {
  BAZAR: 'Bazar',
  IGREJA: 'Igreja',
  REUNIAO: 'Reunião com a equipe',
  IMPRENSA: 'Imprensa / entrevista',
  OUTRO: 'Outro',
};

export interface EntradaRequest {
  objetivo: ObjetivoAcesso;
  visitanteId: number | null;
  moradorId: number | null;
  veiculoId: number | null;   // opcional: pessoa chegou com veículo
  nome: string | null;
  documento: string | null;
  finalidade: FinalidadeAcesso | null;
  descricao: string | null;
}

export interface AcessoResponse {
  id: number;
  objetivo: ObjetivoAcesso;
  nome: string;            // pessoa que entrou
  detalhe: string;         // "Visita a ...", itens doados, finalidade...
  veiculo: string | null;  // "placa - marca modelo (cor)" ou null (a pé)
  entrada: string;
  saida: string | null;
}

export interface FiltroAcesso {
  busca?: string;
  de?: string;  // yyyy-MM-dd
  ate?: string; // yyyy-MM-dd
}
