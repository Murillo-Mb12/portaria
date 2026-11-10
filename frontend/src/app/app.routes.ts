import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { Shell } from './layout/shell/shell';

/**
 * Cada tela é carregada sob demanda (lazy loading): o navegador só baixa o código
 * de uma tela quando ela é aberta pela primeira vez, então o sistema abre mais rápido.
 */
export const routes: Routes = [
  {
    path: 'login',
    title: 'Login - Portaria',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    // Tudo aqui dentro usa o layout com menu e exige login
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'entrada-saida' },
      {
        path: 'entrada-saida',
        title: 'Entrada / Saída',
        loadComponent: () => import('./pages/entrada-saida/entrada-saida').then((m) => m.EntradaSaida),
      },
      {
        path: 'visitantes',
        title: 'Visitantes',
        loadComponent: () => import('./pages/visitantes/visitantes').then((m) => m.Visitantes),
      },
      {
        path: 'moradores',
        title: 'Moradores',
        loadComponent: () => import('./pages/moradores/moradores').then((m) => m.Moradores),
      },
      {
        path: 'veiculos',
        title: 'Veículos',
        loadComponent: () => import('./pages/veiculos/veiculos').then((m) => m.Veiculos),
      },
      {
        path: 'funcionarios',
        title: 'Funcionários',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/funcionarios/funcionarios').then((m) => m.Funcionarios),
      },
      {
        path: 'consulta',
        title: 'Consulta de acessos',
        loadComponent: () => import('./pages/consulta/consulta').then((m) => m.Consulta),
      },
      {
        path: 'relatorio',
        title: 'Relatórios',
        loadComponent: () => import('./pages/relatorio/relatorio').then((m) => m.Relatorio),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
