// Versão instalada (ng build / Docker): igual ao environment.ts, mas sem mostrar
// os usuários e senhas de demonstração na tela de login.
export const environment = {
  apiUrl: '/api',
  demonstracao: null as string | null,
};
