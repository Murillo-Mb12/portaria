# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Porteiros** do Lar São Vicente de Paulo (LSVP), em Sorocaba (SP). Perfis variados, incluindo pessoas mais velhas e com pouca familiaridade com computador (confirmado pela equipe). Trabalham no balcão da portaria registrando quem chega e quem sai, muitas vezes com a pessoa esperando na frente deles.
- **Administrador** da instituição: além do trabalho da portaria, cadastra funcionários e acompanha o histórico e os relatórios.

## Product Purpose

Sistema web que substitui o controle manual (papel e planilhas) da portaria de uma Instituição de Longa Permanência para Idosos (ILPI). Registra a entrada e a saída de cada pessoa, com o objetivo da ida ao Lar (visita a um morador, doação ou outros, como bazar, igreja, reunião com a equipe e imprensa) e, opcionalmente, o veículo. Mantém cadastros de moradores, visitantes, veículos e funcionários, mostra quem está no Lar agora e permite consultar o histórico e emitir relatórios por período.

Sucesso: o porteiro registra uma entrada em poucos segundos, sem erro e sem precisar de ajuda; a administração encontra qualquer acesso passado rapidamente.

## Positioning

Diferente dos sistemas de portaria para empresas e condomínios, o fluxo é desenhado para uma ILPI: cada visitante é vinculado aos moradores que pode visitar (familiar, cuidador ou amigo), a entrada registra o objetivo (visita, doação ou outros) e um mesmo carro pode ser usado por várias pessoas da mesma família. Não depende de equipamentos nem de licenças pagas.

## Operating Context

- Uso em **computador fixo** (mouse e teclado) **e em tablet ou celular** no balcão, conforme a disponibilidade (confirmado).
- A instituição tem mais de 80 moradores; listas de moradores precisam de busca.
- Ritmo de balcão: a tarefa mais frequente é registrar entrada e saída; os cadastros são menos frequentes.
- Os horários registrados importam: a tela mostra data e hora como referência.

## Capabilities and Constraints

- Telas: Login; Entrada / Saída (com lista "Presentes agora"); Visitantes; Moradores; Veículos; Funcionários (só administrador); Consulta de acessos; Relatórios (com impressão / PDF).
- Perfis: ADMINISTRADOR e PORTEIRO. O menu do porteiro não mostra Funcionários.
- Campos com máscara: CPF (000.000.000-00), telefone/celular e placa (ABC-1234 ou ABC1D23).
- Stack existente: Angular 21 (standalone, signals, zoneless) consumindo API REST Spring Boot. Interface em fonte do sistema operacional (Segoe UI no Windows da portaria, Roboto no Android), sem depender de internet.
- Termos do domínio: morador, visitante, vínculo (familiar, cuidador, amigo), objetivo (visita, doação, outros), finalidade, presentes, unidade (ala e quarto).

## Brand Commitments

- Identidade: **emblema da Sociedade de São Vicente de Paulo (SSVP Brasil)**, entregue pela equipe como "ícone do Lar" (arquivos `public/logo-lsvp.png` e `public/logo-lsvp-64.png`). Usar o emblema inteiro, sem recortar nem recolorir.
- Cores oficiais medidas no emblema: **azul #0053A1** e **vermelho #E20613**. O vermelho é de destaque pontual (como no emblema), nunca cor de fundo de áreas grandes.
- Nome exibido: "Lar São Vicente de Paulo" / "Portaria".
- **Direção visual (pedido da equipe, nas palavras dela): "front-end com cara de sistema de portaria profissional".** A versão anterior, em neutros quentes com botões em pílula e cartões amplos, foi rejeitada por "ainda estar com cara de IA". A referência é o software profissional de controle de acesso e portaria: console operacional, informação densa e bem alinhada, componentes sóbrios e cores institucionais.

## Evidence on Hand

- Dados de exemplo fictícios nas migrações (V2) para demonstração.
- Emblema SSVP Brasil entregue pela equipe. Não há depoimentos nem métricas de uso; não fabricar.

## Product Principles

1. **Registrar uma entrada é a tarefa principal**: ela deve ser a mais rápida e a mais visível do sistema.
2. **Clareza antes de densidade**: textos grandes, rótulos explícitos e uma ação principal por área, para pessoas mais velhas e pouco acostumadas com computador.
3. **Erros evitáveis não acontecem**: máscaras, listas filtradas (só moradores do visitante, só veículos do visitante) e mensagens que dizem o que fazer.
4. **Funciona no balcão em qualquer tela**: computador, tablet ou celular, com alvos de toque confortáveis.
5. **O sistema é da instituição**: identidade SSVP (azul e vermelho), tom profissional e respeitoso.

## Accessibility & Inclusion

- Público com pessoas mais velhas: texto base generoso, alto contraste, foco visível para teclado e alvos de toque de pelo menos 44 px.
- Referência: WCAG 2.2 nível AA.
