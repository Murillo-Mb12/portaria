// Endereço da API Spring Boot (backend).
// É um caminho relativo: o navegador chama o mesmo servidor que entregou a tela, e ele repassa
// tudo que começa com /api para o backend (proxy.conf.json no "npm start", pasta nginx/ no Docker).
// Assim o sistema funciona também no tablet ou celular da portaria, e não só em "localhost".
export const environment = {
  apiUrl: '/api',
  // Usuários de demonstração mostrados na tela de login (só no "npm start", nunca na versão instalada)
  demonstracao: 'porteiro / 1234 ou admin / admin123' as string | null,
};
