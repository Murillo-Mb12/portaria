export type VinculoVisitante = 'FAMILIAR' | 'CUIDADOR' | 'AMIGO';

export const VINCULO_LABEL: Record<VinculoVisitante, string> = {
  FAMILIAR: 'Familiar',
  CUIDADOR: 'Cuidador(a)',
  AMIGO: 'Amigo(a)',
};

export interface MoradorResumo {
  id: number;
  nome: string;
  unidade: string;
}

export interface VisitanteRequest {
  nome: string;
  documento: string;
  telefone: string;
  vinculo: VinculoVisitante;
  moradorIds: number[];
}

export interface VisitanteResponse {
  id: number;
  nome: string;
  documento: string;
  telefone: string;
  vinculo: VinculoVisitante;
  moradores: MoradorResumo[];
}
