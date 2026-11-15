import {
  Component, ElementRef, afterRenderEffect, computed, effect, forwardRef, input, signal, untracked, viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { contem } from '../../../core/utils/texto';
import { Icone } from '../icone/icone';

export interface OpcaoBusca {
  id: number;
  rotulo: string;     // o que aparece no campo depois de escolher
  detalhe?: string;   // linha de apoio na lista (também entra na busca)
}

/**
 * Campo de escolha com busca: a pessoa digita um pedaço do nome e escolhe na lista.
 * Substitui o <select> quando a lista é grande (ex.: todos os visitantes cadastrados).
 * A busca ignora acentos e maiúsculas e procura no rótulo e no detalhe.
 *
 * Teclado: digitar filtra, ↓ ↑ andam na lista, Enter escolhe, Esc fecha.
 *
 * Uso (o valor do formControl é o id da opção, ou null):
 *   <label for="visitante">Visitante</label>
 *   <app-campo-busca inputId="visitante" formControlName="visitanteId" [opcoes]="opcoes()" />
 */
@Component({
  selector: 'app-campo-busca',
  imports: [Icone],
  templateUrl: './campo-busca.html',
  styleUrl: './campo-busca.css',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CampoBusca), multi: true }],
})
export class CampoBusca implements ControlValueAccessor {
  opcoes = input.required<OpcaoBusca[]>();
  /** id do <input>, para ligar com o <label for="..."> */
  inputId = input.required<string>();
  placeholder = input('Digite para buscar');
  /** Texto quando não há nenhuma opção cadastrada */
  vazio = input('Nenhuma opção cadastrada.');
  /** Quantas opções a lista mostra de cada vez */
  limite = input(40);

  protected valor = signal<number | null>(null);
  protected texto = signal('');
  protected aberto = signal(false);
  protected digitando = signal(false);
  protected ativo = signal(0);
  protected desabilitado = signal(false);

  protected selecionada = computed(() => this.opcoes().find((o) => o.id === this.valor()) ?? null);

  /** Enquanto a pessoa digita, só as opções que batem com o texto; senão, todas. */
  protected filtradas = computed(() =>
    this.digitando() ? this.opcoes().filter((o) => contem(this.texto(), o.rotulo, o.detalhe)) : this.opcoes(),
  );
  protected visiveis = computed(() => this.filtradas().slice(0, this.limite()));
  protected ocultas = computed(() => this.filtradas().length - this.visiveis().length);

  private campo = viewChild.required<ElementRef<HTMLInputElement>>('campo');
  private lista = viewChild<ElementRef<HTMLElement>>('lista');

  private onChange: (valor: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Mostra no campo o nome da opção escolhida (inclusive quando as opções chegam depois do valor)
    effect(() => {
      const rotulo = this.selecionada()?.rotulo ?? '';
      if (!untracked(this.digitando)) this.texto.set(rotulo);
    });

    // Mantém a opção destacada visível ao andar com as setas
    afterRenderEffect(() => {
      this.ativo();
      this.lista()?.nativeElement.querySelector('.ativa')?.scrollIntoView({ block: 'nearest' });
    });
  }

  /** Coloca o cursor no campo (usado para já deixar pronto para a próxima pessoa). */
  focar(): void {
    this.campo().nativeElement.focus();
  }

  protected abrir(): void {
    if (this.aberto() || this.desabilitado()) return;
    const atual = this.visiveis().findIndex((o) => o.id === this.valor());
    this.ativo.set(Math.max(0, atual));
    this.aberto.set(true);
  }

  protected aoDigitar(texto: string): void {
    this.texto.set(texto);
    this.digitando.set(true);
    this.ativo.set(0);
    this.aberto.set(true);
  }

  protected aoTeclar(evento: KeyboardEvent): void {
    switch (evento.key) {
      case 'ArrowDown':
        evento.preventDefault();
        if (this.aberto()) this.ativo.update((i) => Math.min(i + 1, this.visiveis().length - 1));
        else this.abrir();
        break;
      case 'ArrowUp':
        evento.preventDefault();
        this.ativo.update((i) => Math.max(i - 1, 0));
        break;
      case 'Enter': {
        const opcao = this.aberto() ? this.visiveis()[this.ativo()] : undefined;
        if (opcao) {
          evento.preventDefault(); // escolhe a opção em vez de enviar o formulário
          this.escolher(opcao);
        }
        break;
      }
      case 'Escape':
        if (this.aberto()) {
          evento.stopPropagation();
          this.restaurar();
        }
        break;
    }
  }

  protected escolher(opcao: OpcaoBusca): void {
    this.definir(opcao.id);
    this.digitando.set(false);
    this.aberto.set(false);
    this.texto.set(opcao.rotulo);
  }

  protected limpar(): void {
    this.definir(null);
    this.digitando.set(false);
    this.texto.set('');
    this.focar();
  }

  /** Ao sair do campo: apagar todo o texto limpa a escolha; texto pela metade volta para a opção escolhida. */
  protected aoSair(): void {
    if (this.digitando() && !this.texto().trim()) this.definir(null);
    this.restaurar();
    this.onTouched();
  }

  private restaurar(): void {
    this.digitando.set(false);
    this.aberto.set(false);
    this.texto.set(this.selecionada()?.rotulo ?? '');
  }

  private definir(valor: number | null): void {
    if (valor === this.valor()) return;
    this.valor.set(valor);
    this.onChange(valor);
  }

  // ---- ControlValueAccessor: liga o componente ao formControlName ----
  writeValue(valor: number | null): void {
    this.valor.set(valor ?? null);
    this.digitando.set(false);
  }

  registerOnChange(fn: (valor: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(desabilitado: boolean): void {
    this.desabilitado.set(desabilitado);
  }
}
