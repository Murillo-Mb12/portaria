---
name: Portaria LSVP
description: Console de portaria do Lar São Vicente de Paulo — registro de entradas e saídas, cadastros e histórico.
colors:
  marca: "#0053a1"
  marca-forte: "#003f7d"
  marca-suave: "#e6eef8"
  marca-borda: "#a9c2e2"
  ssvp-vermelho: "#e20613"
  tinta: "#17212b"
  tinta-2: "#4d5866"
  placeholder: "#7a8493"
  fundo: "#eef1f5"
  superficie: "#ffffff"
  cab-painel: "#f6f8fb"
  linha: "#d5dbe3"
  linha-campo: "#8a94a3"
  hover: "#f2f6fb"
  zebra: "#fafbfd"
  barra-rolagem: "#b7c0cc"
  visita-fundo: "#e6eef8"
  visita-texto: "#0053a1"
  doacao-fundo: "#e3f3e9"
  doacao-texto: "#0f6b3a"
  outros-fundo: "#fdf0d9"
  outros-texto: "#8a4b00"
  admin-fundo: "#eee9f8"
  admin-texto: "#4f3596"
  sucesso: "#0f6b3a"
  sucesso-fundo: "#e9f5ee"
  erro: "#b3121c"
  erro-fundo: "#fdeced"
  erro-texto: "#8e0f16"
  marca-pressionada: "#00336a"
  selecao-texto: "#cfe0f4"
  linha-edicao: "#fff8e1"
  barra-texto-2: "#d6e4f4"
  linha-recente: "#d7e6f7"
  ponto-vazio: "#a3acb8"
typography:
  display:
    fontFamily: "Segoe UI, system-ui, -apple-system, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "Segoe UI, system-ui, -apple-system, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Segoe UI, system-ui, -apple-system, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  table:
    fontFamily: "Segoe UI, system-ui, -apple-system, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
  label:
    fontFamily: "Segoe UI, system-ui, -apple-system, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
  clock:
    fontFamily: "Segoe UI, system-ui, -apple-system, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.15
    fontFeature: "tnum"
  panel-heading:
    fontFamily: "Segoe UI, system-ui, -apple-system, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
  display-mobile:
    fontFamily: "Segoe UI, system-ui, -apple-system, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.25
  caption:
    fontFamily: "Segoe UI, system-ui, -apple-system, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  barra-rolagem: "10px"
  selo: "3px"
  controle: "4px"
  painel: "6px"
  emblema: "50%"
spacing:
  campo-altura: "42px"
  painel: "20px"
  grupo: "16px"
  pagina: "24px"
components:
  button-primary:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.controle}"
    padding: "0 18px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.marca-forte}"
  button-secondary:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.controle}"
    padding: "0 18px"
    height: "42px"
  input:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.controle}"
    padding: "0 12px"
    height: "42px"
  panel:
    backgroundColor: "{colors.superficie}"
    rounded: "{rounded.painel}"
    padding: "20px"
  panel-header:
    backgroundColor: "{colors.cab-painel}"
    textColor: "{colors.tinta}"
    padding: "12px 20px"
  nav-item-active:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.controle}"
    height: "40px"
  app-bar:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.superficie}"
    height: "60px"
  badge-visita:
    backgroundColor: "{colors.visita-fundo}"
    textColor: "{colors.visita-texto}"
    rounded: "{rounded.selo}"
    padding: "2px 8px"
  badge-doacao:
    backgroundColor: "{colors.doacao-fundo}"
    textColor: "{colors.doacao-texto}"
    rounded: "{rounded.selo}"
    padding: "2px 8px"
  badge-outros:
    backgroundColor: "{colors.outros-fundo}"
    textColor: "{colors.outros-texto}"
    rounded: "{rounded.selo}"
    padding: "2px 8px"
---

# Design System: Portaria LSVP

## Overview

**Creative North Star: "O Console da Portaria"** *(proposta; confirmar com a equipe)*

Um software profissional de portaria, no padrão dos sistemas de controle de acesso usados em portarias de verdade. No topo, uma barra institucional azul com o emblema da Sociedade de São Vicente de Paulo e um filete vermelho; à esquerda, um menu sóbrio; no centro, painéis com cabeçalho, tabelas densas e componentes retangulares. A tela principal é um console: a situação do dia em cima, o registro à esquerda e os presentes à direita, sem trocar de tela.

A versão anterior (neutros quentes, botões em pílula, cartões amplos com ícones, saudações e subtítulos em toda tela) foi rejeitada pela equipe por "ainda estar com cara de IA". O sistema recusa esse vocabulário de propósito.

**Key Characteristics:**
- Barra institucional azul SSVP com emblema em selo branco e filete vermelho de 3 px.
- Fonte do sistema operacional: aparência de programa instalado.
- Painéis brancos com faixa de cabeçalho cinza, cantos de 6 px.
- Botões, campos e selos retangulares (4 px e 3 px).
- Tabelas densas, com zebra discreta e números tabulares.

## Colors

Cinzas frios de software com as duas cores do emblema SSVP: o azul domina a identidade, o vermelho aparece só como filete.

### Primary
- **Azul SSVP** (#0053a1): barra superior, item ativo do menu, botão principal, segmento selecionado, foco. Medido no emblema.
- **Azul SSVP Profundo** (#003f7d): hover do botão principal.
- **Azul de Seleção** (#e6eef8): selo Visita, hover de botões pequenos, linha recém-registrada (#d7e6f7 no pico).

### Secondary
- **Vermelho SSVP** (#e20613): filete sob a barra superior e no topo do login. Medido no emblema.

### Neutral
- **Tinta** (#17212b): texto principal.
- **Tinta de Apoio** (#4d5866): rótulos, cabeçalhos de tabela, textos secundários (7:1).
- **Fundo do Console** (#eef1f5): área de trabalho.
- **Painel** (#ffffff) e **Cabeçalho de Painel** (#f6f8fb).
- **Divisória** (#d5dbe3) e **Borda de Campo** (#8a94a3, 3:1).

### Named Rules
**A Regra do Filete.** O vermelho SSVP nunca preenche áreas: é filete e emblema.

**A Regra do Azul que Comanda.** O azul marca onde se está (menu, barra) e o que fazer (botão principal, segmento ativo). Nada mais é azul preenchido.

## Typography

**Display / Body:** Segoe UI no Windows (Roboto no Android, San Francisco no iOS), via `system-ui`.
**Character:** A fonte do próprio sistema operacional faz o console parecer um programa instalado, e não um site; não depende de internet.

### Hierarchy
- **Display** (600, 24px; 21px no celular): título da página.
- **Title** (600, 16px): título de painel.
- **Body** (400, 16px, 1.45): campos e texto.
- **Table** (400, 15px, números tabulares): tabelas.
- **Label** (600, 14px): rótulos de campo e grupos do menu.
- **Caption** (600, 13px): cabeçalho de tabela e selos.
- **Clock** (600, 20px, tabular): relógio da barra superior; **Panel heading** (600, 18px): título do login e destaque de painel.

## Layout

Barra superior fixa de 60 px; menu lateral fixo de 248 px; conteúdo até 1400 px com 24 px de margem. Na Entrada e saída, a partir de 1280 px, o console usa duas colunas (360 px de registro + tabela). Abaixo de 960 px o menu vira gaveta (botão na barra) e as tabelas rolam com a coluna de ações fixa à direita; abaixo de 600 px os botões ocupam a largura toda e a faixa de situação fica em três colunas compactas.

## Elevation & Depth

Plano, com bordas de 1 px e uma sombra mínima nos painéis. Sombras maiores só em elementos sobrepostos.

### Shadow Vocabulary
- **Painel** (`box-shadow: 0 1px 2px rgba(23,33,43,.06)`).
- **Gaveta** (`box-shadow: 0 10px 30px rgba(23,33,43,.2)`).
- **Login** (`box-shadow: 0 2px 4px rgba(0,0,0,.08), 0 16px 40px rgba(0,20,50,.3)`).

## Shapes

Formas retas de software: selos 3 px, controles 4 px, painéis 6 px. O único círculo é o selo branco do emblema.

## Components

### Buttons
- **Primary:** azul SSVP, texto branco, 42 px, 4 px, peso 600.
- **Secondary:** branco com borda #8a94a3 e texto escuro.
- **Pequeno (ações de linha):** 34 px; azul com borda clara, ou vermelho com borda clara para Excluir.

### Selos (Visita, Doação, Outros, perfis)
Retângulos de 3 px com fundo claro, borda da mesma família e texto escuro, 13 px.

### Painéis
Branco, borda #d5dbe3, cantos de 6 px; faixa de cabeçalho #f6f8fb com título de 16 px e contagem em caixinha. Tabelas encostam nas bordas do painel.

### Inputs
Borda #8a94a3, 42 px, 4 px; foco com borda azul e halo `rgba(0,83,161,.2)`.

### Navigation
Itens de 40 px com ícone de 18 px; grupos Portaria / Cadastros / Histórico; ativo em azul SSVP preenchido com texto branco.

### Console de Entrada e saída (assinatura)
Faixa de situação (No Lar agora / Entradas hoje / Saídas hoje), objetivo em controle segmentado de três partes e tabela de presentes com pessoa e detalhe, selo, placa, hora e tempo, e "Registrar saída". A linha recém-registrada acende em azul e esmaece em 3 s.

## Do's and Don'ts

### Do:
- **Do** usar o emblema SSVP inteiro, sem recortar nem recolorir.
- **Do** colocar cada bloco de conteúdo num painel com faixa de cabeçalho.
- **Do** manter controles com 40-44 px e texto de no mínimo 13 px (14 px em rótulos).

### Don't:
- **Don't** usar botões em pílula, neutros creme ou cartões amplos com ícone em quadradinho: foi o que fez a versão anterior "parecer IA".
- **Don't** colocar subtítulo explicativo sob o título de cada página nem saudações.
- **Don't** preencher áreas com o vermelho SSVP.
- **Don't** usar caracteres de texto ou emoji como ícones; os ícones são SVG de traço.
