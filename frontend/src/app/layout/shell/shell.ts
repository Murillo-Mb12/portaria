import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { PERFIL_LABEL } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';

/** Layout do sistema logado: menu lateral + área das páginas. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  protected auth = inject(AuthService);
  private router = inject(Router);
  protected readonly perfilLabel = PERFIL_LABEL;

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
