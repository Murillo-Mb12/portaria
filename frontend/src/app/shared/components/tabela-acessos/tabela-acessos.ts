import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { AcessoResponse, OBJETIVO_LABEL } from '../../../core/models';

/** Tabela de acessos usada na Consulta (RF10) e no Relatório (RF11). */
@Component({
  selector: 'app-tabela-acessos',
  imports: [DatePipe],
  templateUrl: './tabela-acessos.html',
})
export class TabelaAcessos {
  acessos = input.required<AcessoResponse[]>();
  protected readonly objetivoLabel = OBJETIVO_LABEL;
}
