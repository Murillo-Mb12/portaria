import { Component, inject } from '@angular/core';

import { AcaoAviso, AvisosService } from '../../../core/services/avisos.service';
import { Icone } from '../icone/icone';

/**
 * Faixa de aviso no rodapé da tela ("Saída de Ana registrada. [Desfazer]").
 * Fica no layout (shell) e mostra o que o AvisosService mandar.
 * A região tem aria-live: leitores de tela anunciam a mensagem quando ela aparece.
 */
@Component({
  selector: 'app-avisos',
  imports: [Icone],
  template: `
    <div class="regiao noprint" [attr.aria-live]="avisos.atual()?.tipo === 'erro' ? 'assertive' : 'polite'" aria-atomic="true">
      @if (avisos.atual(); as a) {
        <div class="aviso" [class.erro]="a.tipo === 'erro'"
             (mouseenter)="avisos.pausar()" (mouseleave)="avisos.retomar()"
             (focusin)="avisos.pausar()" (focusout)="avisos.retomar()">
          <app-icone class="simbolo" [nome]="a.tipo === 'erro' ? 'alerta' : 'check'" [tamanho]="22" />
          <span class="texto">{{ a.texto }}</span>
          @if (a.acao; as acao) {
            <button type="button" class="sm" (click)="executar(acao)">{{ acao.rotulo }}</button>
          }
          <button type="button" class="leve fechar" (click)="avisos.fechar()" aria-label="Fechar aviso">
            <app-icone nome="fechar" [tamanho]="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .regiao {
      position: fixed; z-index: 60; left: 0; right: 0; bottom: 20px;
      display: flex; justify-content: flex-end; padding: 0 20px; pointer-events: none;
    }
    .aviso {
      pointer-events: auto;
      display: flex; align-items: center; gap: 12px;
      max-width: 620px; padding: 10px 10px 10px 16px;
      background: var(--sucesso-fundo); color: var(--tinta);
      border: 0; border-radius: var(--raio-painel);
      box-shadow: var(--sombra-alta);
      font-size: 16px; line-height: 1.35;
      animation: subir .22s cubic-bezier(.16, 1, .3, 1);
    }
    .aviso.erro { background: var(--erro-fundo); }
    .simbolo { color: var(--sucesso); }
    .erro .simbolo { color: var(--erro); }
    .texto { flex: 1; min-width: 0; font-weight: 600; }
    .fechar {
      flex-shrink: 0; width: 34px; min-height: 34px; padding: 0;
      background: transparent; color: var(--tinta-2); border-color: transparent;
    }
    .aviso .fechar:hover { background: color-mix(in srgb, currentColor 12%, transparent); }
    @keyframes subir {
      from { opacity: 0; transform: translateY(10px); }
    }
    @media (max-width: 600px) {
      .regiao { bottom: 12px; padding: 0 12px; }
      .aviso { width: 100%; }
    }
  `,
})
export class Avisos {
  protected avisos = inject(AvisosService);

  executar(acao: AcaoAviso): void {
    this.avisos.fechar();
    acao.executar();
  }
}
