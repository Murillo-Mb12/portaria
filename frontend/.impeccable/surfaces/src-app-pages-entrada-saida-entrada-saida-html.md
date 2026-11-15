---
version: 1
slug: "src-app-pages-entrada-saida-entrada-saida-html"
primary_target: "src/app/pages/entrada-saida/entrada-saida.html"
related_targets: ["src/app/layout/shell/shell.html","src/styles.css"]
---

## Scope
Redesenho completo do front-end (modo Operate): shell, Login, Entrada e saída, Visitantes, Moradores, Veículos, Funcionários, Consulta e Relatórios. Tela principal: Entrada e saída. A versão "console de portaria" foi recusada pelo usuário por parecer painel genérico e ser pouco agradável de usar; azul e vermelho SSVP continuam, agora com cores de apoio. Uso dia e noite: tema claro e escuro.

## Direction contract

THESIS: A portaria com a calma da capela do Lar: parede caiada, madeira clara e o azul de Maria em tom suave; nada de caixas com borda, só superfícies brancas pousadas sobre a cal. Recusa o painel administrativo genérico e o esmalte pesado da Placa Esmaltada, que o grupo achou carregado.

OWN-WORLD: Cal #F7F8F7 de fundo, superfície #FFFFFF com sombra levíssima (0 1px 2px #0000000d, 0 8px 24px -16px #2b344033) e raio 16 px; tinta #2B3440, apoio #626C78; azul mariano #3E6FB0 (ação, item ativo, visita) com tom suave #DCE6F2; madeira #C9B79C como filete de 4 px no menu; verde #4E9A6F (doação), ocre #C9993A (outros) como pontos de 10 px; vermelho SSVP #E20613 só no filete da barra; azul SSVP #0053A1 no emblema e nome do Lar; campos preenchidos #F2F4F3 sem borda; Source Sans 3 (400/600/700) em tudo; à noite, cal escura #14181D, superfície #1C2128, mariano #8AB0E0.

STORY: O porteiro vê no topo quantas pessoas estão no Lar, registra a entrada no cartão à esquerda e encontra cada presente pelo ponto colorido do objetivo; quem saiu hoje fica em cinza e ainda pode ser desfeito.

FIRST VIEWPORT: Barra clara com emblema, nome do Lar em azul SSVP e um filete vermelho curto, relógio, tema e Sair; menu lateral claro com filete de madeira e grupos (Portaria, Cadastros, Histórico), item ativo em mariano suave; título com a pílula "5 pessoas no Lar agora" e o resumo "6 entradas · 1 saída hoje"; cartão de registro de 360 px com seletor segmentado; cartão "Presentes agora" em lista com ponto, nome, detalhe, veículo, hora à direita e Registrar saída; "Saíram hoje" em cinza.

FORM: Capela caiada, escolha do Impeccable (pick) na rodada seed:55eb819cbbc16f9c. Reforços: cor só no que tem significado (objetivo, item ativo), quem saiu fica em cinza até o fim do dia, horários à direita em números tabulares, hierarquia pelo tamanho do texto, uma só família de letras.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
