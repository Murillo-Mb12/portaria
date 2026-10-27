import { Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface OpcaoSelecao {
  id: number;
  rotulo: string;
  detalhe?: string;
}

/**
 * Lista de caixas de seleção ligada a um FormControl<number[]>.
 * Uso: <app-selecao-multipla [control]="form.controls.moradorIds" [opcoes]="opcoes()" />
 */
@Component({
  selector: 'app-selecao-multipla',
  templateUrl: './selecao-multipla.html',
  styleUrl: './selecao-multipla.css',
})
export class SelecaoMultipla {
  control = input.required<FormControl<number[]>>();
  opcoes = input.required<OpcaoSelecao[]>();
  vazio = input('Nenhuma opção cadastrada.');

  marcado(id: number): boolean {
    return this.control().value.includes(id);
  }

  alternar(id: number, marcado: boolean): void {
    const atual = this.control().value;
    this.control().setValue(marcado ? [...atual, id] : atual.filter((x) => x !== id));
    this.control().markAsTouched();
  }
}
