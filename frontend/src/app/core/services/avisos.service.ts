import { Injectable, signal } from '@angular/core';

export interface AcaoAviso {
  rotulo: string;          // ex.: "Desfazer"
  executar: () => void;
}

export interface Aviso {
  tipo: 'ok' | 'erro';
  texto: string;
  acao?: AcaoAviso;
}

/**
 * Avisos que aparecem no rodapé da tela, em qualquer página (componente <app-avisos> no layout).
 * Servem para confirmar o que acabou de acontecer ("Saída de Ana registrada") sem depender de
 * onde a pessoa está olhando: a mensagem fica sempre visível, mesmo com a tela rolada.
 *
 *  - sucesso: some sozinho depois de alguns segundos (mais tempo quando tem botão, ex.: Desfazer);
 *  - erro: fica até ser fechado, para dar tempo de ler.
 */
@Injectable({ providedIn: 'root' })
export class AvisosService {
  readonly atual = signal<Aviso | null>(null);

  private timer?: ReturnType<typeof setTimeout>;
  private duracao = 0;

  sucesso(texto: string, acao?: AcaoAviso): void {
    this.mostrar({ tipo: 'ok', texto, acao }, acao ? 12_000 : 6_000);
  }

  erro(texto: string): void {
    this.mostrar({ tipo: 'erro', texto }, 0);
  }

  fechar(): void {
    clearTimeout(this.timer);
    this.atual.set(null);
  }

  /** Enquanto o mouse ou o foco está no aviso, ele não some. */
  pausar(): void {
    clearTimeout(this.timer);
  }

  retomar(): void {
    clearTimeout(this.timer);
    if (this.duracao && this.atual()) {
      this.timer = setTimeout(() => this.atual.set(null), this.duracao);
    }
  }

  private mostrar(aviso: Aviso, duracao: number): void {
    this.duracao = duracao;
    this.atual.set(aviso);
    this.retomar();
  }
}
