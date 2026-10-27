import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  MoradorResponse,
  TIPO_VEICULO_LABEL,
  TipoVeiculo,
  VeiculoRequest,
  VeiculoResponse,
  VisitanteResponse,
} from '../../core/models';
import { MoradorService } from '../../core/services/morador.service';
import { VeiculoService } from '../../core/services/veiculo.service';
import { VisitanteService } from '../../core/services/visitante.service';
import { mensagemErro } from '../../core/utils/mensagem-erro';
import { PLACA_REGEX } from '../../core/utils/validadores';
import { ErroCampo } from '../../shared/components/erro-campo/erro-campo';

/** Uma linha de "pessoa que usa o veículo": filtro por morador + visitante escolhido. */
type LinhaPessoa = FormGroup<{
  moradorId: FormControl<number | null>;
  visitanteId: FormControl<number | null>;
}>;

/** A lista de pessoas precisa ter pelo menos uma linha. */
function peloMenosUmaPessoa(control: AbstractControl): ValidationErrors | null {
  return (control as FormArray).length ? null : { semPessoas: true };
}

// RF04 - Cadastro de veículos (CRUD)
@Component({
  selector: 'app-veiculos',
  imports: [ReactiveFormsModule, ErroCampo],
  templateUrl: './veiculos.html',
  styleUrl: './veiculos.css',
})
export class Veiculos implements OnInit {
  private service = inject(VeiculoService);
  private visitanteService = inject(VisitanteService);
  private moradorService = inject(MoradorService);
  private fb = inject(FormBuilder);

  protected readonly tipoLabel = TIPO_VEICULO_LABEL;
  protected readonly tipos = Object.keys(TIPO_VEICULO_LABEL) as TipoVeiculo[];

  veiculos = signal<VeiculoResponse[]>([]);
  visitantes = signal<VisitanteResponse[]>([]);
  moradores = signal<MoradorResponse[]>([]);
  editandoId = signal<number | null>(null);
  mensagem = signal('');
  erro = signal('');

  form = this.fb.group({
    placa: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(PLACA_REGEX)]),
    marca: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(40)]),
    modelo: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(40)]),
    cor: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(30)]),
    tipo: this.fb.nonNullable.control<TipoVeiculo>('VISITANTE', Validators.required),
    responsavel: this.fb.nonNullable.control('', Validators.maxLength(100)),
    pessoas: this.fb.array<LinhaPessoa>([], peloMenosUmaPessoa),
  });

  get pessoas(): FormArray<LinhaPessoa> {
    return this.form.controls.pessoas;
  }

  // Tipo escolhido no formulário (decide se mostra "pessoas" ou "responsável")
  tipo = toSignal(this.form.controls.tipo.valueChanges, { initialValue: this.form.controls.tipo.value });
  deVisitante = computed(() => this.tipo() === 'VISITANTE');

  constructor() {
    this.form.controls.tipo.valueChanges.subscribe(() => this.ajustarPorTipo());
    this.ajustarPorTipo();
  }

  ngOnInit(): void {
    this.visitanteService.getAll().subscribe({ next: (l) => this.visitantes.set(l), error: (e) => this.falha(e) });
    this.moradorService.getAll().subscribe({ next: (l) => this.moradores.set(l), error: (e) => this.falha(e) });
    this.carregar();
  }

  carregar(): void {
    this.service.getAll().subscribe({
      next: (lista) => this.veiculos.set(lista),
      error: (e) => this.falha(e),
    });
  }

  // ---------- Pessoas do veículo ----------

  adicionarPessoa(visitanteId: number | null = null): void {
    this.pessoas.push(
      this.fb.group({
        moradorId: this.fb.control<number | null>(null),
        visitanteId: this.fb.control<number | null>(visitanteId, Validators.required),
      }),
    );
  }

  removerPessoa(i: number): void {
    this.pessoas.removeAt(i);
    this.pessoas.markAsTouched();
  }

  /**
   * Visitantes que podem ser escolhidos na linha i:
   *  - se um morador foi escolhido no filtro, só os visitantes desse morador;
   *  - não repete quem já foi escolhido em outra linha.
   */
  opcoesVisitantes(i: number): VisitanteResponse[] {
    const { moradorId } = this.pessoas.at(i).getRawValue();
    const escolhidosEmOutrasLinhas = this.pessoas
      .getRawValue()
      .filter((_, j) => j !== i)
      .map((p) => p.visitanteId);

    return this.visitantes().filter(
      (v) =>
        (!moradorId || v.moradores.some((m) => m.id === moradorId)) &&
        !escolhidosEmOutrasLinhas.includes(v.id),
    );
  }

  /** Ao trocar o filtro: limpa a pessoa se ela não visita aquele morador; se só sobrar uma, já seleciona. */
  aoTrocarMorador(i: number): void {
    const linha = this.pessoas.at(i);
    const opcoes = this.opcoesVisitantes(i);
    if (opcoes.length === 1) {
      linha.controls.visitanteId.setValue(opcoes[0].id);
    } else if (!opcoes.some((v) => v.id === linha.controls.visitanteId.value)) {
      linha.controls.visitanteId.setValue(null);
    }
  }

  moradoresDe(visitanteId: number): string {
    return this.visitantes().find((v) => v.id === visitanteId)?.moradores.map((m) => m.nome).join(', ') ?? '';
  }

  // ---------- CRUD ----------

  quemUsa(v: VeiculoResponse): string {
    return v.tipo === 'VISITANTE' ? v.pessoas.map((p) => p.nome).join(', ') : (v.responsavel ?? '');
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const f = this.form.getRawValue();
    const deVisitante = f.tipo === 'VISITANTE';
    const dados: VeiculoRequest = {
      placa: f.placa,
      marca: f.marca,
      modelo: f.modelo,
      cor: f.cor,
      tipo: f.tipo,
      responsavel: deVisitante ? null : f.responsavel,
      pessoaIds: deVisitante ? f.pessoas.map((p) => p.visitanteId!) : [],
    };
    const id = this.editandoId();
    const requisicao: Observable<unknown> = id ? this.service.update(id, dados) : this.service.save(dados);

    requisicao.subscribe({
      next: () => {
        this.sucesso(id ? 'Veículo atualizado!' : 'Veículo cadastrado!');
        this.cancelar();
        this.carregar();
      },
      error: (e) => this.falha(e),
    });
  }

  editar(v: VeiculoResponse): void {
    this.cancelar();
    this.editandoId.set(v.id);
    this.form.patchValue({
      placa: v.placa,
      marca: v.marca,
      modelo: v.modelo,
      cor: v.cor,
      tipo: v.tipo,
      responsavel: v.responsavel ?? '',
    });
    v.pessoas.forEach((p) => this.adicionarPessoa(p.id));
    this.mensagem.set('');
  }

  excluir(v: VeiculoResponse): void {
    if (!confirm(`Excluir o veículo ${v.placa}?`)) return;
    this.service.delete(v.id).subscribe({
      next: () => {
        this.sucesso('Veículo excluído.');
        if (this.editandoId() === v.id) this.cancelar();
        this.carregar();
      },
      error: (e) => this.falha(e),
    });
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.pessoas.clear();
    this.form.reset();
    this.ajustarPorTipo();
  }

  /**
   * VISITANTE         -> usa a lista de pessoas (habilitada e obrigatória)
   * INSTITUICAO/OUTRO -> usa o campo responsável (obrigatório); a lista fica desabilitada
   */
  private ajustarPorTipo(): void {
    const { responsavel } = this.form.controls;
    if (this.form.controls.tipo.value === 'VISITANTE') {
      this.pessoas.enable({ emitEvent: false });
      responsavel.setValidators(Validators.maxLength(100));
    } else {
      this.pessoas.disable({ emitEvent: false });
      responsavel.setValidators([Validators.required, Validators.maxLength(100)]);
    }
    responsavel.updateValueAndValidity({ emitEvent: false });
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
