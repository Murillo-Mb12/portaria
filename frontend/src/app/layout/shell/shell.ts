import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { PERFIL_LABEL } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { TemaService } from '../../core/services/tema.service';
import { Avisos } from '../../shared/components/avisos/avisos';
import { DialogoConfirmacao } from '../../shared/components/dialogo-confirmacao/dialogo-confirmacao';
import { Icone } from '../../shared/components/icone/icone';

/** Layout do sistema logado: menu lateral, barra com data/hora e área das páginas. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe, Icone, Avisos, DialogoConfirmacao],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
  host: { '(document:keydown.escape)': 'menuAberto.set(false)' },
})
export class Shell {
  protected auth = inject(AuthService);
  protected tema = inject(TemaService);
  private router = inject(Router);
  protected readonly perfilLabel = PERFIL_LABEL;

  // Relógio da portaria (referência para os horários de entrada e saída)
  protected agora = signal(new Date());

  // Menu em gaveta (celular e tablet); Esc fecha
  protected menuAberto = signal(false);

  constructor() {
    // Atualiza o relógio a cada 10 s e para o timer quando o layout é destruído (logout)
    const relogio = setInterval(() => this.agora.set(new Date()), 10_000);
    inject(DestroyRef).onDestroy(() => clearInterval(relogio));

    // Fecha a gaveta ao trocar de tela
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.menuAberto.set(false));
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
