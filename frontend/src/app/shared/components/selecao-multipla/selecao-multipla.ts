import { Component, computed, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface OpcaoSelecao {
  id: number;
  rotulo: string;
  detalhe?: string;
}

/** Remove acentos e deixa minúsculo: "Graças" -> "gracas" */
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/**
 * Lista de caixas de seleção ligada a um FormControl<number[]>, com:
 *  - busca rápida (lupa), que ignora acentos e procura no nome e no detalhe;
 *  - só as primeiras `limite` opções visíveis + botão "Ver mais" para abrir a lista completa;
 *  - resumo dos itens marcados (mesmo os que estão escondidos), com botão para remover.
 *
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
  placeholder = input('Pesquisar...');
  /** Quantas opções aparecem antes do "Ver mais" */
  limite = input(6);

  busca = signal('');
  expandido = signal(false);

  /** Opções que batem com o texto pesquisado */
  filtradas = computed(() => {
    const termo = normalizar(this.busca());
    if (!termo) return this.opcoes();
    return this.opcoes().filter((o) => normalizar(`${o.rotulo} ${o.detalhe ?? ''}`).includes(termo));
  });

  /** O que aparece na tela: as primeiras N ou todas (depois do "Ver mais") */
  visiveis = computed(() =>
    this.expandido() ? this.filtradas() : this.filtradas().slice(0, this.limite()),
  );

  escondidas = computed(() => this.filtradas().length - this.visiveis().length);

  pesquisar(texto: string): void {
    this.busca.set(texto);
    this.expandido.set(false);
  }

  limparBusca(): void {
    this.pesquisar('');
  }

  alternarExpandido(): void {
    this.expandido.update((v) => !v);
  }

  marcado(id: number): boolean {
    return this.control().value.includes(id);
  }

  /** Itens marcados, para o resumo no topo */
  selecionados(): OpcaoSelecao[] {
    const ids = this.control().value;
    return this.opcoes().filter((o) => ids.includes(o.id));
  }

  alternar(id: number, marcado: boolean): void {
    const atual = this.control().value;
    this.control().setValue(marcado ? [...atual, id] : atual.filter((x) => x !== id));
    this.control().markAsTouched();
  }
}
