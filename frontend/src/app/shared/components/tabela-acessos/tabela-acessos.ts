import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { AcessoResponse, OBJETIVO_LABEL } from '../../../core/models';
import { duracao } from '../../../core/utils/datas';

/** Tabela de acessos usada na Consulta (RF10) e no Relatório (RF11). */
@Component({
  selector: 'app-tabela-acessos',
  imports: [DatePipe],
  templateUrl: './tabela-acessos.html',
})
export class TabelaAcessos {
  acessos = input.required<AcessoResponse[]>();
  /** Mostra as linhas de espera enquanto a primeira busca não chega */
  carregando = input(false);
  vazio = input('Nenhum acesso encontrado.');

  protected readonly objetivoLabel = OBJETIVO_LABEL;

  /** "FJK2B31 - Fiat Uno (Prata)" -> "FJK2B31" */
  placa(veiculo: string): string {
    return veiculo.split(' - ')[0];
  }

  /** "FJK2B31 - Fiat Uno (Prata)" -> "Fiat Uno (Prata)" */
  modelo(veiculo: string): string {
    return veiculo.split(' - ').slice(1).join(' - ');
  }

  /** Quanto tempo a pessoa ficou no Lar (só para quem já saiu). */
  permanencia(a: AcessoResponse): string {
    if (!a.saida) return '—';
    const tempo = duracao(a.entrada, a.saida);
    return tempo === 'agora' ? 'menos de 1 min' : tempo;
  }
}
