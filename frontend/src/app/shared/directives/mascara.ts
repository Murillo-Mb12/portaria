import { Directive, ElementRef, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type TipoMascara = 'cpf' | 'telefone' | 'placa';

/** 12345678900 -> 123.456.789-00 */
export function formatarCpf(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** 1532214410 -> (15) 3221-4410 | 15998123344 -> (15) 99812-3344 */
export function formatarTelefone(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (!d) return '';
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const numero = d.slice(2);
  if (numero.length <= 4) return `(${ddd}) ${numero}`;
  if (numero.length <= 8) return `(${ddd}) ${numero.slice(0, 4)}-${numero.slice(4)}`; // fixo
  return `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`;                         // celular
}

/**
 * Placa antiga: abc1234 -> ABC-1234
 * Placa Mercosul: abc1d23 -> ABC1D23
 * Só aceita letra nas 3 primeiras posições, número na 4ª e nas duas últimas.
 */
export function formatarPlaca(valor: string): string {
  let placa = '';
  for (const c of valor.toUpperCase().replace(/[^A-Z0-9]/g, '')) {
    const i = placa.length;
    const aceita =
      i < 3 ? /[A-Z]/.test(c) : i === 3 ? /\d/.test(c) : i === 4 ? /[A-Z0-9]/.test(c) : /\d/.test(c);
    if (aceita) placa += c;
    if (placa.length === 7) break;
  }
  const padraoAntigo = placa.length >= 5 && /\d/.test(placa[4]);
  return padraoAntigo ? `${placa.slice(0, 3)}-${placa.slice(3)}` : placa;
}

const FORMATADORES: Record<TipoMascara, (v: string) => string> = {
  cpf: formatarCpf,
  telefone: formatarTelefone,
  placa: formatarPlaca,
};

const TAMANHO_MAXIMO: Record<TipoMascara, number> = { cpf: 14, telefone: 15, placa: 8 };

/**
 * Formata o campo enquanto o usuário digita.
 * Uso: <input formControlName="cpf" appMascara="cpf">
 *      <input formControlName="telefone" appMascara="telefone">
 *      <input formControlName="placa" appMascara="placa">
 */
@Directive({
  selector: 'input[appMascara]',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Mascara), multi: true }],
  host: {
    '(input)': 'aoDigitar()',
    '(blur)': 'aoSair()',
    '[attr.maxlength]': 'tamanhoMaximo()',
    '[attr.inputmode]': 'appMascara() === "placa" ? "text" : "numeric"',
    '[attr.autocomplete]': '"off"',
  },
})
export class Mascara implements ControlValueAccessor {
  appMascara = input.required<TipoMascara>();

  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private onChange: (valor: string) => void = () => {};
  private onTouched: () => void = () => {};

  tamanhoMaximo(): number {
    return TAMANHO_MAXIMO[this.appMascara()];
  }

  aoDigitar(): void {
    const formatado = FORMATADORES[this.appMascara()](this.el.nativeElement.value);
    this.el.nativeElement.value = formatado;
    this.onChange(formatado);
  }

  aoSair(): void {
    this.onTouched();
  }

  // ---- ControlValueAccessor: liga a diretiva ao formControlName ----
  writeValue(valor: string | null): void {
    this.el.nativeElement.value = FORMATADORES[this.appMascara()](valor ?? '');
  }

  registerOnChange(fn: (valor: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(desabilitado: boolean): void {
    this.el.nativeElement.disabled = desabilitado;
  }
}
