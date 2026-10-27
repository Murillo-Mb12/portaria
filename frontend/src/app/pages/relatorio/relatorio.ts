import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AcessoResponse } from '../../core/models';
import { AcessoService } from '../../core/services/acesso.service';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { TabelaAcessos } from '../../shared/components/tabela-acessos/tabela-acessos';

// RF11 - Relatório de acessos por período
@Component({
  selector: 'app-relatorio',
  imports: [ReactiveFormsModule, TabelaAcessos],
  templateUrl: './relatorio.html',
})
export class Relatorio {
  private service = inject(AcessoService);
  private fb = inject(FormBuilder);

  acessos = signal<AcessoResponse[] | null>(null);
  erro = signal('');

  periodo = this.fb.nonNullable.group({
    de: ['', Validators.required],
    ate: ['', Validators.required],
  });

  gerar(): void {
    const { de, ate } = this.periodo.getRawValue();
    if (this.periodo.invalid) {
      this.erro.set('Informe as duas datas.');
      return;
    }
    if (de > ate) {
      this.erro.set('A data inicial não pode ser maior que a final.');
      return;
    }
    this.service.getAll({ de, ate }).subscribe({
      next: (lista) => {
        this.acessos.set(lista);
        this.erro.set('');
      },
      error: (e) => this.erro.set(mensagemErro(e)),
    });
  }

  imprimir(): void {
    window.print();
  }
}
