import { DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { PERFIL_LABEL } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { Icone } from '../../shared/components/icone/icone';

/** Layout do sistema logado: menu lateral, barra com data/hora e área das páginas. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe, Icone],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  protected auth = inject(AuthService);
  private router = inject(Router);
  protected readonly perfilLabel = PERFIL_LABEL;

  // Relógio da portaria (referência para os horários de entrada e saída)
  protected agora = signal(new Date());

  protected saudacao = computed(() => {
    const hora = this.agora().getHours();
    return hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  });

  protected primeiroNome = computed(() => this.auth.usuario()?.nome.split(' ')[0] ?? '');

  protected iniciais = computed(() => {
    const partes = (this.auth.usuario()?.nome ?? '').trim().split(/\s+/);
    return ((partes[0]?.[0] ?? '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase();
  });

  constructor() {
    // Atualiza o relógio a cada 10 s e para o timer quando o layout é destruído (logout)
    const relogio = setInterval(() => this.agora.set(new Date()), 10_000);
    inject(DestroyRef).onDestroy(() => clearInterval(relogio));
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
