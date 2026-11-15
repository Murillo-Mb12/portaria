import { Injectable, signal } from '@angular/core';

export interface PedidoConfirmacao {
  titulo: string;        // "Excluir o morador José Carlos Pereira?"
  texto?: string;        // explicação curta do que acontece
  confirmar: string;     // rótulo do botão que confirma: "Excluir"
  perigo?: boolean;      // ação que não dá para desfazer (botão em vermelho)
}

/**
 * Pergunta de confirmação no visual do sistema (componente <app-dialogo-confirmacao> no layout),
 * no lugar do confirm() do navegador.
 *
 * Uso:  if (await this.confirmacao.perguntar({ titulo: 'Excluir?', confirmar: 'Excluir', perigo: true })) { ... }
 */
@Injectable({ providedIn: 'root' })
export class ConfirmacaoService {
  readonly pedido = signal<PedidoConfirmacao | null>(null);

  private resolver?: (confirmou: boolean) => void;

  perguntar(pedido: PedidoConfirmacao): Promise<boolean> {
    this.resolver?.(false); // se já havia uma pergunta aberta, ela conta como "não"
    this.pedido.set(pedido);
    return new Promise<boolean>((resolve) => (this.resolver = resolve));
  }

  responder(confirmou: boolean): void {
    this.pedido.set(null);
    this.resolver?.(confirmou);
    this.resolver = undefined;
  }
}
