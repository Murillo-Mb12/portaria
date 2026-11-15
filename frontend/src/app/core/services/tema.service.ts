import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type Tema = 'auto' | 'claro' | 'escuro';

const CHAVE = 'portaria.tema';

/**
 * Tema claro (dia) ou escuro (plantão noturno).
 *  - "auto": segue o sistema operacional do computador ou tablet;
 *  - "claro" / "escuro": escolha feita no botão da barra, guardada neste aparelho.
 * O CSS lê o atributo data-tema do <html> (ver styles.css).
 */
@Injectable({ providedIn: 'root' })
export class TemaService {
  private documento = inject(DOCUMENT);
  private sistemaEscuro = signal(this.consultaEscuro()?.matches ?? false);

  readonly tema = signal<Tema>(this.lerEscolha());
  /** O tema que está na tela agora, já resolvido o "auto" */
  readonly escuro = computed(() => this.tema() === 'escuro' || (this.tema() === 'auto' && this.sistemaEscuro()));

  constructor() {
    this.consultaEscuro()?.addEventListener('change', (e) => this.sistemaEscuro.set(e.matches));

    effect(() => {
      const tema = this.tema();
      const raiz = this.documento.documentElement;
      if (tema === 'auto') raiz.removeAttribute('data-tema');
      else raiz.setAttribute('data-tema', tema);
      try {
        if (tema === 'auto') localStorage.removeItem(CHAVE);
        else localStorage.setItem(CHAVE, tema);
      } catch {
        // navegador sem armazenamento (janela anônima): a escolha vale só até fechar
      }
    });
  }

  /** Botão da barra: troca entre claro e escuro a partir do que está na tela. */
  alternar(): void {
    this.tema.set(this.escuro() ? 'claro' : 'escuro');
  }

  private lerEscolha(): Tema {
    try {
      const salvo = localStorage.getItem(CHAVE);
      return salvo === 'claro' || salvo === 'escuro' ? salvo : 'auto';
    } catch {
      return 'auto';
    }
  }

  private consultaEscuro(): MediaQueryList | null {
    return typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
  }
}
