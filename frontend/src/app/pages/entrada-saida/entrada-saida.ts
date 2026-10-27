import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import {
  AcessoResponse,
  EntradaRequest,
  FINALIDADE_LABEL,
  FinalidadeAcesso,
  OBJETIVO_LABEL,
  ObjetivoAcesso,
  VeiculoResponse,
  VisitanteResponse,
  descricaoVeiculo,
} from '../../core/models';
import { AcessoService } from '../../core/services/acesso.service';
import { VeiculoService } from '../../core/services/veiculo.service';
import { VisitanteService } from '../../core/services/visitante.service';
import { mensagemErro } from '../../core/utils/mensagem-erro';

interface OpcaoObjetivo {
  valor: ObjetivoAcesso;
  titulo: string;
  descricao: string;
}

// RF06 a RF09 - Entrada e saída (a pessoa pode ou não estar com um veículo)
@Component({
  selector: 'app-entrada-saida',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './entrada-saida.html',
  styleUrl: './entrada-saida.css',
})
export class EntradaSaida implements OnInit {
  private acessoService = inject(AcessoService);
  private visitanteService = inject(VisitanteService);
  private veiculoService = inject(VeiculoService);
  private fb = inject(FormBuilder);

  protected readonly objetivoLabel = OBJETIVO_LABEL;
  protected readonly finalidadeLabel = FINALIDADE_LABEL;
  protected readonly finalidades = Object.keys(FINALIDADE_LABEL) as FinalidadeAcesso[];
  protected readonly descricaoVeiculo = descricaoVeiculo;
  protected readonly objetivos: OpcaoObjetivo[] = [
    { valor: 'VISITA', titulo: '1. Visitante', descricao: 'Parente, cuidador ou amigo de um morador' },
    { valor: 'DOACAO', titulo: '2. Doação', descricao: 'Entrega de doações para o Lar' },
    { valor: 'OUTROS', titulo: '3. Outros', descricao: 'Bazar, igreja, reunião, imprensa...' },
  ];

  visitantes = signal<VisitanteResponse[]>([]);
  veiculos = signal<VeiculoResponse[]>([]);
  presentes = signal<AcessoResponse[]>([]);
  mensagem = signal('');
  erro = signal('');

  objetivo = signal<ObjetivoAcesso>('VISITA');

  form = this.fb.group({
    visitanteId: [null as number | null],
    moradorId: [null as number | null],
    veiculoId: [null as number | null],
    nome: [''],
    documento: [''],
    finalidade: [null as FinalidadeAcesso | null],
    descricao: [''],
  });

  private visitanteId = toSignal(this.form.controls.visitanteId.valueChanges, { initialValue: null });

  /** Só os moradores vinculados ao visitante escolhido. */
  moradoresDoVisitante = computed(
    () => this.visitantes().find((v) => v.id === this.visitanteId())?.moradores ?? [],
  );

  /**
   * Veículos que aparecem no campo "Veículo (opcional)":
   *  - Visita: só os veículos em que o visitante está vinculado (ex.: carro da família)
   *  - Doação / Outros: todos os veículos cadastrados
   */
  veiculosDisponiveis = computed<VeiculoResponse[]>(() => {
    if (this.objetivo() !== 'VISITA') return this.veiculos();
    const id = this.visitanteId();
    return id ? this.veiculos().filter((v) => v.pessoas.some((p) => p.id === id)) : [];
  });

  constructor() {
    // Ao trocar o visitante: se ele tiver só um morador, já vem selecionado; o veículo volta para "sem veículo"
    this.form.controls.visitanteId.valueChanges.subscribe(() => {
      const moradores = this.moradoresDoVisitante();
      this.form.controls.moradorId.setValue(moradores.length === 1 ? moradores[0].id : null);
      this.form.controls.veiculoId.setValue(null);
    });
  }

  ngOnInit(): void {
    this.visitanteService.getAll().subscribe({ next: (l) => this.visitantes.set(l), error: (e) => this.falha(e) });
    this.veiculoService.getAll().subscribe({ next: (l) => this.veiculos.set(l), error: (e) => this.falha(e) });
    this.carregarPresentes();
  }

  carregarPresentes(): void {
    this.acessoService.getPresentes().subscribe({
      next: (l) => this.presentes.set(l),
      error: (e) => this.falha(e),
    });
  }

  escolherObjetivo(objetivo: ObjetivoAcesso): void {
    this.objetivo.set(objetivo);
    this.limparCampos();
  }

  registrar(): void {
    const f = this.form.getRawValue();
    const objetivo = this.objetivo();
    const visita = objetivo === 'VISITA';

    // Conferência rápida antes de enviar (o backend valida tudo de novo)
    const faltando =
      (visita && !f.visitanteId && 'Selecione o visitante.') ||
      (visita && !f.moradorId && 'Selecione o morador visitado.') ||
      (!visita && !f.nome?.trim() && 'Informe o nome.') ||
      (objetivo === 'DOACAO' && !f.descricao?.trim() && 'Descreva os itens doados.') ||
      (objetivo === 'OUTROS' && !f.finalidade && 'Selecione a finalidade.');
    if (faltando) {
      this.erro.set(faltando);
      this.mensagem.set('');
      return;
    }

    const entrada: EntradaRequest = {
      objetivo,
      visitanteId: visita ? f.visitanteId : null,
      moradorId: visita ? f.moradorId : null,
      veiculoId: f.veiculoId,
      nome: visita ? null : f.nome?.trim() || null,
      documento: visita ? null : f.documento?.trim() || null,
      finalidade: objetivo === 'OUTROS' ? f.finalidade : null,
      descricao: visita ? null : f.descricao?.trim() || null,
    };

    this.acessoService.registrarEntrada(entrada).subscribe({
      next: (a) => {
        this.sucesso(`Entrada registrada: ${a.nome}${a.veiculo ? ' com o veículo ' + a.veiculo : ''}.`);
        this.limparCampos();
        this.carregarPresentes();
      },
      error: (e) => this.falha(e),
    });
  }

  registrarSaida(a: AcessoResponse): void {
    this.acessoService.registrarSaida(a.id).subscribe({
      next: () => {
        this.sucesso(`Saída de ${a.nome} registrada.`);
        this.carregarPresentes();
      },
      error: (e) => this.falha(e),
    });
  }

  private limparCampos(): void {
    this.form.reset({ visitanteId: null, moradorId: null, veiculoId: null, nome: '', documento: '', finalidade: null, descricao: '' });
  }

  private sucesso(msg: string): void {
    this.mensagem.set(msg);
    this.erro.set('');
  }

  private falha(e: unknown): void {
    this.erro.set(mensagemErro(e));
    this.mensagem.set('');
  }
}
