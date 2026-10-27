import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { AcessoResponse } from '../../core/models';
import { AcessoService } from '../../core/services/acesso.service';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { TabelaAcessos } from '../../shared/components/tabela-acessos/tabela-acessos';

// RF10 - Consulta de acessos (o filtro é feito no backend)
@Component({
  selector: 'app-consulta',
  imports: [ReactiveFormsModule, TabelaAcessos],
  templateUrl: './consulta.html',
})
export class Consulta implements OnInit {
  private service = inject(AcessoService);
  private fb = inject(FormBuilder);

  acessos = signal<AcessoResponse[]>([]);
  erro = signal('');

  filtro = this.fb.nonNullable.group({
    busca: [''],
    de: [''],
    ate: [''],
  });

  ngOnInit(): void {
    this.filtrar();
  }

  filtrar(): void {
    this.service.getAll(this.filtro.getRawValue()).subscribe({
      next: (lista) => {
        this.acessos.set(lista);
        this.erro.set('');
      },
      error: (e) => this.erro.set(mensagemErro(e)),
    });
  }

  limpar(): void {
    this.filtro.reset();
    this.filtrar();
  }
}
