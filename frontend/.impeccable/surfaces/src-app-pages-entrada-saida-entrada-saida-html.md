---
version: 1
slug: "src-app-pages-entrada-saida-entrada-saida-html"
primary_target: "src/app/pages/entrada-saida/entrada-saida.html"
related_targets: ["src/app/layout/shell/shell.html","src/styles.css"]
---

## Scope
Refazer o front-end inteiro (modo Operate): shell, Login, Entrada / Saída, Visitantes, Moradores, Veículos, Funcionários, Consulta e Relatórios. Tela principal: Entrada / Saída.

## Direction contract

THESIS: Um console de portaria profissional, como os softwares de controle de acesso usados em portarias de verdade: barra institucional azul com o emblema, menu lateral sóbrio, painéis com cabeçalho, tabelas densas e bem alinhadas e componentes retangulares. Recusa o visual "feito por IA": nada de neutros creme, botões em pílula, cartões amplos com ícone em quadradinho, saudações e subtítulos explicativos em toda tela.

OWN-WORLD: Azul institucional SSVP #0053A1 na barra superior e no item ativo; vermelho SSVP #E20613 só como filete sob a barra e no emblema; cinzas frios de software (fundo #EEF1F5, painéis brancos, bordas #D5DBE3); fonte do sistema operacional (Segoe UI/Roboto); botões e campos retangulares de 4px com 40-44px de altura; selos de status retangulares (Visita, Doação, Outros); números tabulares.

STORY: O porteiro abre o console, vê quantas pessoas estão no Lar, quantas entraram e saíram hoje, registra a entrada no painel da esquerda e acompanha os presentes na tabela da direita, sem trocar de tela.

FIRST VIEWPORT: Barra azul (emblema em selo branco, "Lar São Vicente de Paulo / Sistema de Portaria", relógio, data, usuário e Sair) com filete vermelho; menu lateral branco com item ativo azul; título "Entrada e saída"; faixa de situação com No Lar agora / Entradas hoje / Saídas hoje; console em duas colunas: painel "Registrar entrada" (objetivo em controle segmentado, campos empilhados, botão de largura total) e painel "Presentes agora" (tabela com pessoa e detalhe, selo de objetivo, veículo, hora, tempo e "Registrar saída").

FORM: seed: none (pinned) — a equipe fixou o mundo e a tela nas próprias palavras: "faça um front-end com cara de sistema de portaria profissional", com "o ícone do lar" (emblema SSVP) e as cores dele.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
