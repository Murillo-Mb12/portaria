import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Mostra a mensagem de validação de um campo do formulário.
 * Uso: <app-erro-campo [control]="form.controls.nome" />
 */
@Component({
  selector: 'app-erro-campo',
  template: `
    @if (control().invalid && control().touched) {
      <small class="err">{{ mensagem() }}</small>
    }
  `,
})
export class ErroCampo {
  control = input.required<AbstractControl>();
  /** Texto exibido quando o campo não bate com o pattern */
  formato = input('Formato inválido.');

  mensagem(): string {
    const erros = this.control().errors ?? {};
    if (erros['required']) return 'Campo obrigatório.';
    if (erros['minlength']) return `Mínimo de ${erros['minlength'].requiredLength} caracteres.`;
    if (erros['maxlength']) return `Máximo de ${erros['maxlength'].requiredLength} caracteres.`;
    if (erros['pattern']) return this.formato();
    return 'Valor inválido.';
  }
}
