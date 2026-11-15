import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TemaService } from './core/services/tema.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  // Aplica o tema claro/escuro já na tela de login
  private tema = inject(TemaService);
}
