import { Component, DestroyRef, ElementRef, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

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
import { AvisosService } from '../../core/services/avisos.service';
import { VeiculoService } from '../../core/services/veiculo.service';
import { VisitanteService } from '../../core/services/visitante.service';
import { dataLocal, duracao } from '../../core/utils/datas';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { contem } from '../../core/utils/texto';
import { CPF_REGEX } from '../../core/utils/validadores';
import { CampoBusca, OpcaoBusca } from '../../shared/components/campo-busca/campo-busca';
import { Icone, NomeIcone } from '../../shared/components/icone/icone';
import { Mascara } from '../../shared/directives/mascara';

interface OpcaoObjetivo {
  valor: ObjetivoAcesso;
  titulo: string;
  descricao: string;
  icone: NomeIcone;
}

// RF06 a RF09 - Entrada e saída (a pessoa pode ou não estar com um veículo)
@Component({
  selector: 'app-entrada-saida',
  imports: [ReactiveFormsModule, RouterLink, Mascara, Icone, CampoBusca],
  templateUrl: './entrada-saida.html',
  styleUrl: './entrada-saida.css',
  // Ao voltar para a aba do sistema, atualiza a lista (outra pessoa pode ter registrado algo em outro aparelho)
  host: { '(document:visibilitychange)': 'aoVoltarParaATela()' },
})
export class EntradaSaida implements OnInit {
  private acessoService = inject(AcessoService);
  private visitanteService = inject(VisitanteService);
  private veiculoService = inject(VeiculoService);
  private avisos = inject(AvisosService);
  private fb = inject(FormBuilder);

  private formulario = viewChild.required<ElementRef<HTMLFormElement>>('formulario');

  protected readonly objetivoLabel = OBJETIVO_LABEL;
  protected readonly finalidadeLabel = FINALIDADE_LABEL;
  protected readonly finalidades = Object.keys(FINALIDADE_LABEL) as FinalidadeAcesso[];
  protected readonly descricaoVeiculo = descricaoVeiculo;
  protected readonly objetivos: OpcaoObjetivo[] = [
    { valor: 'VISITA', titulo: 'Visitante', descricao: 'Parente, cuidador ou amigo de um morador.', icone: 'visita' },
    { valor: 'DOACAO', titulo: 'Doação', descricao: 'Entrega de doações para o Lar.', icone: 'doacao' },
    { valor: 'OUTROS', titulo: 'Outros', descricao: 'Bazar, igreja, reunião com a equipe, imprensa.', icone: 'outros' },
  ];

  visitantes = signal<VisitanteResponse[]>([]);
  veiculos = signal<VeiculoResponse[]>([]);
  presentes = signal<AcessoResponse[]>([]);

  objetivo = signal<ObjetivoAcesso>('VISITA');

  // Formulário de entrada
  erro = signal('');
  enviando = signal(false);       // trava o botão enquanto o servidor responde (evita entrada duplicada)

  // Lista de presentes
  carregando = signal(true);      // primeira carga
  erroLista = signal('');
  saindoId = signal<number | null>(null);
  filtro = signal('');

  // Linha recém-registrada em "Presentes agora" (acende e esmaece)
  recenteId = signal<number | null>(null);
  private limparRecente?: ReturnType<typeof setTimeout>;

  // Relógio do "tempo no Lar"
  private agora = signal(Date.now());

  // Movimento do dia (mostradores)
  hoje = signal<AcessoResponse[]>([]);
  entradasHoje = computed(() => this.hoje().length);
  saidasHoje = computed(() => this.hoje().filter((a) => a.saida).length);

  /** Quem entrou hoje e já saiu: continua na tela, com a placa desbotada, da saída mais recente para a mais antiga. */
  saidosHoje = computed(() =>
    this.hoje()
      .filter((a) => a.saida)
      .sort((a, b) => b.saida!.localeCompare(a.saida!)),
  );
  protected readonly limiteSaidos = 6;

  ajudaObjetivo = computed(() => this.objetivos.find((o) => o.valor === this.objetivo())?.descricao ?? '');

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

  /** Visitantes no formato do campo com busca: dá para achar pelo nome, pelo CPF ou pelo morador visitado. */
  opcoesVisitantes = computed<OpcaoBusca[]>(() =>
    this.visitantes().map((v) => ({
      id: v.id,
      rotulo: v.nome,
      detalhe: `CPF ${v.documento} · visita ${v.moradores.map((m) => m.nome).join(', ')}`,
    })),
  );

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

  /** Presentes que batem com a busca da tabela (nome, detalhe ou placa). */
  presentesFiltrados = computed(() =>
    this.presentes().filter((a) => contem(this.filtro(), a.nome, a.detalhe, a.veiculo)),
  );

  constructor() {
    // A cada 30 s: atualiza o "tempo no Lar" e busca a lista de novo (se a tela estiver visível)
    const relogio = setInterval(() => {
      this.agora.set(Date.now());
      if (!document.hidden) this.carregarPresentes();
    }, 30_000);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(relogio);
      clearTimeout(this.limparRecente);
    });

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

  aoVoltarParaATela(): void {
    if (!document.hidden) {
      this.agora.set(Date.now());
      this.carregarPresentes();
    }
  }

  /** Busca os presentes e o movimento de hoje juntos, para os números baterem com a tabela. */
  carregarPresentes(): void {
    const dia = dataLocal();
    forkJoin({
      presentes: this.acessoService.getPresentes(),
      hoje: this.acessoService.getAll({ de: dia, ate: dia }),
    })
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: ({ presentes, hoje }) => {
          this.presentes.set(presentes);
          this.hoje.set(hoje);
          this.erroLista.set('');
        },
        error: (e) => this.erroLista.set(mensagemErro(e)),
      });
  }

  /** Quanto tempo a pessoa está no Lar: "agora", "há 25 min", "há 2 h 05 min" */
  tempoNoLar(entrada: string): string {
    const tempo = duracao(entrada, this.agora());
    return tempo === 'agora' ? tempo : `há ${tempo}`;
  }

  /** "14:05" se a entrada foi hoje; "12/11 14:05" se foi em outro dia. */
  horaEntrada(entrada: string): string {
    const d = new Date(entrada);
    const hm = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return dataLocal(d) === dataLocal()
      ? hm
      : `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${hm}`;
  }

  /** Mostra só a placa na tabela ("FJK2B31 - Fiat Uno (Prata)" -> "FJK2B31"). */
  placa(veiculo: string): string {
    return veiculo.split(' - ')[0];
  }

  escolherObjetivo(objetivo: ObjetivoAcesso): void {
    if (objetivo === this.objetivo()) return;
    this.objetivo.set(objetivo);
    this.erro.set('');
    this.limparCampos();
  }

  /** Setas do teclado trocam o objetivo, como em um grupo de opções comum. */
  aoTeclarObjetivo(evento: KeyboardEvent): void {
    const passos: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const passo = passos[evento.key];
    if (!passo) return;
    evento.preventDefault();
    const atual = this.objetivos.findIndex((o) => o.valor === this.objetivo());
    const novo = (atual + passo + this.objetivos.length) % this.objetivos.length;
    this.escolherObjetivo(this.objetivos[novo].valor);
    const botoes = (evento.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="radio"]');
    botoes[novo]?.focus();
  }

  registrar(): void {
    if (this.enviando()) return;
    const f = this.form.getRawValue();
    const objetivo = this.objetivo();
    const visita = objetivo === 'VISITA';

    // Conferência rápida antes de enviar (o backend valida tudo de novo)
    const faltando =
      (visita && !f.visitanteId && 'Escolha o visitante.') ||
      (visita && !f.moradorId && 'Escolha o morador visitado.') ||
      (!visita && !f.nome?.trim() && 'Informe o nome.') ||
      (!visita && !!f.documento && !CPF_REGEX.test(f.documento) && 'CPF incompleto. Use 000.000.000-00 ou deixe em branco.') ||
      (objetivo === 'DOACAO' && !f.descricao?.trim() && 'Descreva os itens doados.') ||
      (objetivo === 'OUTROS' && !f.finalidade && 'Escolha a finalidade.');
    if (faltando) {
      this.erro.set(faltando);
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

    this.enviando.set(true);
    this.acessoService
      .registrarEntrada(entrada)
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: (a) => {
          this.erro.set('');
          this.avisos.sucesso(`Entrada registrada: ${a.nome}${a.veiculo ? ', veículo ' + this.placa(a.veiculo) : ''}.`);
          this.destacar(a.id);
          this.limparCampos();
          this.agora.set(Date.now());
          this.carregarPresentes();
          this.prepararProximaEntrada();
        },
        error: (e) => this.falha(e),
      });
  }

  registrarSaida(a: AcessoResponse): void {
    if (this.saindoId() !== null) return;
    this.saindoId.set(a.id);
    this.acessoService
      .registrarSaida(a.id)
      .pipe(finalize(() => this.saindoId.set(null)))
      .subscribe({
        next: () => {
          // Clicou na linha errada? O aviso traz o botão para desfazer.
          this.avisos.sucesso(`Saída de ${a.nome} registrada.`, {
            rotulo: 'Desfazer',
            executar: () => this.desfazerSaida(a),
          });
          this.agora.set(Date.now());
          this.carregarPresentes();
        },
        error: (e) => this.avisos.erro(mensagemErro(e)),
      });
  }

  /** A API aceita desfazer a saída só nos primeiros 10 minutos. */
  podeDesfazer(a: AcessoResponse): boolean {
    return !!a.saida && this.agora() - new Date(a.saida).getTime() < 10 * 60_000;
  }

  /** "saiu · ficou 1 h 08 min" (a hora da saída aparece em destaque ao lado) */
  resumoSaida(a: AcessoResponse): string {
    const tempo = duracao(a.entrada, a.saida!);
    return `saiu · ficou ${tempo === 'agora' ? 'menos de 1 min' : tempo}`;
  }

  desfazerSaida(a: AcessoResponse): void {
    this.acessoService.desfazerSaida(a.id).subscribe({
      next: () => {
        this.avisos.sucesso(`Saída desfeita: ${a.nome} continua no Lar.`);
        this.destacar(a.id);
        this.carregarPresentes();
      },
      error: (e) => this.avisos.erro(mensagemErro(e)),
    });
  }

  private destacar(id: number): void {
    clearTimeout(this.limparRecente);
    this.recenteId.set(id);
    this.limparRecente = setTimeout(() => this.recenteId.set(null), 4000);
  }

  /** No computador, o cursor volta para o primeiro campo: é só digitar a próxima pessoa. */
  private prepararProximaEntrada(): void {
    if (!matchMedia('(pointer: fine)').matches) return; // no toque, não abre o teclado sozinho
    setTimeout(() => this.formulario().nativeElement.querySelector<HTMLElement>('input, select')?.focus());
  }

  private limparCampos(): void {
    this.form.reset({ visitanteId: null, moradorId: null, veiculoId: null, nome: '', documento: '', finalidade: null, descricao: '' });
  }

  private falha(e: unknown): void {
    this.erro.set(mensagemErro(e));
  }
}
