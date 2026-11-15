import { Component, ElementRef, afterRenderEffect, inject, viewChild } from '@angular/core';

import { ConfirmacaoService } from '../../../core/services/confirmacao.service';

/**
 * Janela de confirmação ("Excluir o morador ...?") usada pelo ConfirmacaoService.
 * Usa o <dialog> do próprio navegador: ele já prende o foco dentro da janela,
 * fecha com Esc e devolve o foco para o botão que abriu.
 */
@Component({
  selector: 'app-dialogo-confirmacao',
  template: `
    <dialog #janela aria-labelledby="dialogo-titulo"
            (cancel)="$event.preventDefault(); confirmacao.responder(false)"
            (click)="aoClicar($event)">
      @if (confirmacao.pedido(); as p) {
        <div class="conteudo">
          <h2 id="dialogo-titulo">{{ p.titulo }}</h2>
          @if (p.texto) { <p>{{ p.texto }}</p> }
        </div>
        <div class="acoes">
          <button type="button" class="sec" (click)="confirmacao.responder(false)">Cancelar</button>
          <button type="button" [class.perigo]="p.perigo" [class.cheio]="p.perigo" (click)="confirmacao.responder(true)">
            {{ p.confirmar }}
          </button>
        </div>
      }
    </dialog>
  `,
  styles: `
    dialog {
      width: min(460px, calc(100vw - 32px)); padding: 0;
      color: var(--tinta); background: var(--superficie);
      border: 0; border-radius: var(--raio-painel);
      box-shadow: var(--sombra-alta);
    }
    dialog::backdrop { background: rgb(20 24 29 / .45); }
    dialog[open] { animation: abrir .18s cubic-bezier(.16, 1, .3, 1); }
    @keyframes abrir {
      from { opacity: 0; transform: translateY(8px); }
    }
    .conteudo { padding: 22px 24px 20px; }
    h2 { font-size: 18px; font-weight: 600; overflow-wrap: anywhere; }
    p { margin: 8px 0 0; color: var(--tinta-2); font-size: 15px; }
    .acoes {
      display: flex; justify-content: flex-end; gap: 10px; padding: 0 24px 20px;

    }
    @media (max-width: 600px) {
      .acoes { flex-direction: column-reverse; }
    }
  `,
})
export class DialogoConfirmacao {
  protected confirmacao = inject(ConfirmacaoService);
  private janela = viewChild.required<ElementRef<HTMLDialogElement>>('janela');

  constructor() {
    // Abre e fecha o <dialog> conforme existe ou não um pedido (depois de o texto já estar na tela)
    afterRenderEffect(() => {
      const aberto = this.confirmacao.pedido() !== null;
      const janela = this.janela().nativeElement;
      if (aberto && !janela.open) janela.showModal();
      if (!aberto && janela.open) janela.close();
    });
  }

  /** Clique fora da janela (no fundo escurecido) = cancelar. */
  aoClicar(evento: MouseEvent): void {
    if (evento.target === this.janela().nativeElement) this.confirmacao.responder(false);
  }
}
