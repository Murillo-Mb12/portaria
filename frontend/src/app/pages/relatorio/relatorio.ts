import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AcessoResponse, OBJETIVO_LABEL } from '../../core/models';
import { AcessoService } from '../../core/services/acesso.service';
import { AuthService } from '../../core/services/auth.service';
import { dataBr, dataLocal, duracao, inicioDoMes } from '../../core/utils/datas';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { Icone } from '../../shared/components/icone/icone';
import { TabelaAcessos } from '../../shared/components/tabela-acessos/tabela-acessos';

// RF11 - Relatório de acessos por período
@Component({
  selector: 'app-relatorio',
  imports: [ReactiveFormsModule, DatePipe, TabelaAcessos, Icone],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.css',
})
export class Relatorio implements OnInit {
  private service = inject(AcessoService);
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);

  acessos = signal<AcessoResponse[] | null>(null);
  gerando = signal(false);
  erro = signal('');

  /** Período e hora do relatório que está na tela (o formulário pode já ter outras datas) */
  periodoGerado = signal({ de: '', ate: '' });
  emitidoEm = signal(new Date());
  textoPeriodo = computed(() => {
    const { de, ate } = this.periodoGerado();
    return de === ate ? dataBr(de) : `${dataBr(de)} a ${dataBr(ate)}`;
  });

  // Resumo do período, por objetivo
  resumo = computed(() => {
    const lista = this.acessos() ?? [];
    return {
      total: lista.length,
      visitas: lista.filter((a) => a.objetivo === 'VISITA').length,
      doacoes: lista.filter((a) => a.objetivo === 'DOACAO').length,
      outros: lista.filter((a) => a.objetivo === 'OUTROS').length,
    };
  });

  // Já abre com o mês atual preenchido
  periodo = this.fb.nonNullable.group({
    de: [inicioDoMes(), Validators.required],
    ate: [dataLocal(), Validators.required],
  });

  ngOnInit(): void {
    this.gerar();
  }

  gerar(): void {
    if (this.gerando()) return;
    const { de, ate } = this.periodo.getRawValue();
    if (this.periodo.invalid) {
      this.erro.set('Informe as duas datas do período.');
      return;
    }
    if (de > ate) {
      this.erro.set('A data inicial não pode ser depois da final.');
      return;
    }
    this.gerando.set(true);
    this.service
      .getAll({ de, ate })
      .pipe(finalize(() => this.gerando.set(false)))
      .subscribe({
        next: (lista) => {
          this.acessos.set(lista);
          this.periodoGerado.set({ de, ate });
          this.emitidoEm.set(new Date());
          this.erro.set('');
        },
        error: (e) => this.erro.set(mensagemErro(e)),
      });
  }

  imprimir(): void {
    window.print();
  }

  /** Baixa o relatório como planilha (.csv com ponto e vírgula, que o Excel em português abre direto). */
  baixarPlanilha(): void {
    const dataHora = new DatePipe('pt-BR');
    const linhas = [
      ['Nome', 'Objetivo', 'Detalhe', 'Veículo', 'Entrada', 'Entrada registrada por', 'Saída', 'Saída registrada por', 'Permanência'],
      ...(this.acessos() ?? []).map((a) => [
        a.nome,
        OBJETIVO_LABEL[a.objetivo],
        a.detalhe ?? '',
        a.veiculo ?? '',
        dataHora.transform(a.entrada, 'dd/MM/yyyy HH:mm') ?? '',
        a.entradaPor ?? '',
        a.saida ? (dataHora.transform(a.saida, 'dd/MM/yyyy HH:mm') ?? '') : 'No Lar',
        a.saidaPor ?? '',
        a.saida ? permanencia(a.entrada, a.saida) : '',
      ]),
    ];
    // Aspas em volta de cada célula (e aspas internas dobradas), para vírgulas e quebras de linha não quebrarem a coluna
    const csv = linhas.map((l) => l.map((c) => `"${celulaSegura(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    // O marcador no início (BOM) faz o Excel reconhecer os acentos
    const arquivo = new Blob([String.fromCharCode(0xfeff) + csv], { type: 'text/csv;charset=utf-8' });

    const { de, ate } = this.periodoGerado();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(arquivo);
    link.download = `acessos_${de}_a_${ate}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

/** Um texto que comece com = + - @ seria lido pelo Excel como fórmula: o apóstrofo faz ele mostrar como texto. */
function celulaSegura(valor: string): string {
  return /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;
}

/** Tempo de permanência para a planilha ("menos de 1 min" em vez de "agora"). */
function permanencia(entrada: string, saida: string): string {
  const tempo = duracao(entrada, saida);
  return tempo === 'agora' ? 'menos de 1 min' : tempo;
}
