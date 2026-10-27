import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { Shell } from './layout/shell/shell';
import { Consulta } from './pages/consulta/consulta';
import { EntradaSaida } from './pages/entrada-saida/entrada-saida';
import { Funcionarios } from './pages/funcionarios/funcionarios';
import { Login } from './pages/login/login';
import { Moradores } from './pages/moradores/moradores';
import { Relatorio } from './pages/relatorio/relatorio';
import { Veiculos } from './pages/veiculos/veiculos';
import { Visitantes } from './pages/visitantes/visitantes';

export const routes: Routes = [
  { path: 'login', component: Login, title: 'Login - Portaria' },
  {
    // Tudo aqui dentro usa o layout com menu e exige login
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'entrada-saida' },
      { path: 'entrada-saida', component: EntradaSaida, title: 'Entrada / Saída' },
      { path: 'visitantes', component: Visitantes, title: 'Visitantes' },
      { path: 'moradores', component: Moradores, title: 'Moradores' },
      { path: 'veiculos', component: Veiculos, title: 'Veículos' },
      { path: 'funcionarios', component: Funcionarios, title: 'Funcionários', canActivate: [adminGuard] },
      { path: 'consulta', component: Consulta, title: 'Consulta de acessos' },
      { path: 'relatorio', component: Relatorio, title: 'Relatórios' },
    ],
  },
  { path: '**', redirectTo: '' },
];
