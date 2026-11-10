import { Component, input } from '@angular/core';

export type NomeIcone =
  | 'entrada' | 'visitante' | 'morador' | 'veiculo' | 'funcionario' | 'consulta' | 'relatorio'
  | 'sair' | 'visita' | 'doacao' | 'outros' | 'relogio' | 'usuario' | 'cadeado';

/**
 * Ícones desenhados em SVG (traço de 2px, estilo linha).
 * Uso: <app-icone nome="visitante" />  — herda a cor do texto (currentColor).
 */
@Component({
  selector: 'app-icone',
  template: `
    <svg viewBox="0 0 24 24" [attr.width]="tamanho()" [attr.height]="tamanho()" aria-hidden="true"
         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      @switch (nome()) {
        @case ('entrada') {
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" />
        }
        @case ('sair') {
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
        }
        @case ('visitante') {
          <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18.5 14.5A6.5 6.5 0 0 1 21.5 20" />
        }
        @case ('morador') {
          <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9v11h14V9" /><path d="M10 20v-5h4v5" />
        }
        @case ('veiculo') {
          <path d="M5 17H3v-5l2.2-5.2A2 2 0 0 1 7 5.5h10a2 2 0 0 1 1.8 1.3L21 12v5h-2" /><path d="M3 12h18" />
          <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M9 17h6" />
        }
        @case ('funcionario') {
          <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="11" r="2.5" /><path d="M5.5 17a3.5 3.5 0 0 1 7 0" /><path d="M15 10h3" /><path d="M15 14h3" />
        }
        @case ('consulta') {
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" />
        }
        @case ('relatorio') {
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /><path d="M8 17v-3" /><path d="M12 17v-6" /><path d="M16 17v-2" />
        }
        @case ('visita') {
          <path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
        }
        @case ('doacao') {
          <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8" /><path d="M12 8v12" />
          <path d="M12 8C10.5 4.5 7 4.5 7 6.5S10 8 12 8zM12 8c1.5-3.5 5-3.5 5-1.5S14 8 12 8z" />
        }
        @case ('outros') {
          <circle cx="12" cy="12" r="9" /><circle cx="8" cy="12" r=".6" /><circle cx="12" cy="12" r=".6" /><circle cx="16" cy="12" r=".6" />
        }
        @case ('relogio') {
          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
        }
        @case ('usuario') {
          <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
        }
        @case ('cadeado') {
          <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
        }
      }
    </svg>
  `,
  styles: `:host { display: inline-flex; flex-shrink: 0; }`,
})
export class Icone {
  nome = input.required<NomeIcone>();
  tamanho = input(20);
}
