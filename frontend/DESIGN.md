---
name: Portaria LSVP
description: Sistema de portaria do Lar São Vicente de Paulo — registro de entradas e saídas, cadastros e histórico.
colors:
  marca: "#1351b4"
  marca-forte: "#0c3d8c"
  marca-suave: "#e8effa"
  marca-borda: "#b9cdee"
  tinta: "#2b2a26"
  tinta-2: "#5f5d57"
  fundo: "#fafaf8"
  lateral: "#f3f2ee"
  superficie: "#ffffff"
  linha: "#e7e5e0"
  linha-campo: "#8d8a83"
  hover: "#f1f0ec"
  visita-fundo: "#e3edfb"
  visita-texto: "#1351b4"
  doacao-fundo: "#def3e6"
  doacao-texto: "#136b3e"
  outros-fundo: "#fcefd6"
  outros-texto: "#7f4a00"
  admin-fundo: "#ece6fb"
  admin-texto: "#57399f"
  sucesso: "#136b3e"
  sucesso-fundo: "#e9f6ee"
  erro: "#b42318"
  erro-fundo: "#fdeeec"
  foco: "#c2850c"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible, system-ui, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Atkinson Hyperlegible, system-ui, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.35
  small:
    fontFamily: "Atkinson Hyperlegible, system-ui, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  etiqueta: "6px"
  campo: "8px"
  item-menu: "10px"
  cartao: "12px"
  pilula: "999px"
spacing:
  campo-altura: "44px"
  grupo: "18px"
  cartao: "24px"
  pagina-x: "40px"
  pagina-y: "32px"
components:
  button-primary:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.pilula}"
    padding: "0 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.marca-forte}"
  button-secondary:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.marca}"
    rounded: "{rounded.pilula}"
    padding: "0 24px"
    height: "44px"
  input:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.campo}"
    padding: "0 14px"
    height: "44px"
  card:
    backgroundColor: "{colors.superficie}"
    rounded: "{rounded.cartao}"
    padding: "24px"
  nav-item-active:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.item-menu}"
  chip-visita:
    backgroundColor: "{colors.visita-fundo}"
    textColor: "{colors.visita-texto}"
    rounded: "{rounded.etiqueta}"
    padding: "3px 10px"
  chip-doacao:
    backgroundColor: "{colors.doacao-fundo}"
    textColor: "{colors.doacao-texto}"
    rounded: "{rounded.etiqueta}"
    padding: "3px 10px"
  chip-outros:
    backgroundColor: "{colors.outros-fundo}"
    textColor: "{colors.outros-texto}"
    rounded: "{rounded.etiqueta}"
    padding: "3px 10px"
---

# Design System: Portaria LSVP

## Overview

**Creative North Star: "O Balcão Acolhedor"** *(proposta; confirmar com a equipe)*

Um sistema de gestão no formato que todo mundo já conhece — menu lateral, cabeçalho de página, cartões e tabelas — com o acabamento de Notion/Trello e a acessibilidade do gov.br. A diferença está no tom: fundos neutros levemente quentes no lugar do cinza corporativo, letra grande e muito legível, botões em pílula e etiquetas coloridas que dizem o objetivo de cada acesso de relance. O usuário é o porteiro de uma instituição de cuidado, muitas vezes com a pessoa esperando no balcão; nada pode parecer frio, denso ou difícil.

A densidade é confortável: campos e botões com 44 px, uma ação principal por área, textos de apoio curtos explicando cada tela. A cor da marca é reservada para ação e seleção; o resto da tela é neutro.

**Key Characteristics:**
- Cânone de sistemas de gestão, sem ironia e sem enfeites temáticos.
- Neutros quentes (fundo #fafaf8, menu #f3f2ee) e cartões brancos com borda de 1px.
- Fonte única Atkinson Hyperlegible, de alta legibilidade.
- Botões em pílula, campos de 44 px e foco âmbar bem visível (padrão gov.br).
- Etiquetas coloridas por objetivo (Visita, Doação, Outros) e por perfil.

## Colors

Neutros quentes com uma única cor de marca para ação e seleção, mais um conjunto pequeno de cores semânticas para etiquetas e mensagens.

### Primary
- **Azul de Marca — provisório** (#1351b4): botões principais, item ativo do menu (ícone), opção selecionada, seleção de texto. **Provisório:** será substituído pela cor principal do logotipo do LSVP quando o arquivo for entregue.
- **Azul de Marca Profundo** (#0c3d8c): hover do botão principal e texto sobre fundo de marca suave.
- **Azul de Marca Suave** (#e8effa): fundo da opção selecionada, linha recém-registrada, halo de foco dos campos.

### Neutral
- **Tinta Quente** (#2b2a26): texto principal.
- **Tinta de Apoio** (#5f5d57): descrições, rótulos secundários, cabeçalhos de tabela (≥4,5:1).
- **Fundo de Trabalho** (#fafaf8): área principal das páginas.
- **Menu Lateral** (#f3f2ee): menu, cabeçalho de tabela, página de login.
- **Superfície** (#ffffff): cartões, campos, item ativo do menu.
- **Divisória** (#e7e5e0): bordas de cartão e linhas de tabela.
- **Borda de Campo** (#8d8a83): contorno de campos (≥3:1 contra o branco).

### Semânticas
- **Visita** (#e3edfb / #1351b4), **Doação** (#def3e6 / #136b3e), **Outros** (#fcefd6 / #7f4a00), **Administrador** (#ece6fb / #57399f): etiquetas.
- **Sucesso** (#136b3e sobre #e9f6ee), **Erro** (#b42318 sobre #fdeeec): mensagens e validação.
- **Foco** (#c2850c): contorno de foco do teclado.

### Named Rules
**A Regra da Cor que Age.** A cor de marca aparece só onde há ação ou seleção (botão principal, opção marcada, item ativo). Fundos e textos são neutros.

**A Regra da Etiqueta.** Objetivo e perfil são sempre etiquetas coloridas de fundo suave e texto escuro da mesma família, nunca texto colorido solto.

## Typography

**Display Font:** Atkinson Hyperlegible (com system-ui, Segoe UI, Roboto, Arial)
**Body Font:** Atkinson Hyperlegible
**Character:** Uma única família, criada pelo Braille Institute para leitura fácil; distingue 0/O e 1/l/I, o que importa em placas e CPFs. Embutida no projeto, funciona sem internet.

### Hierarchy
- **Display** (700, 30px, 1.2; 26px no celular): título da página (h1).
- **Title** (700, 20px, 1.3): título de cartão (h2).
- **Body** (400, 16px, 1.5): texto e campos; descrições limitadas a ~68ch.
- **Label** (700, 15px, 1.35): rótulos de campo e de grupo.
- **Small** (400, 14px): ajuda, cabeçalhos de tabela, etiquetas.

### Named Rules
**A Regra do Mínimo de 14.** Nenhum texto da interface fica abaixo de 14 px.

## Layout

Menu lateral fixo de 264 px à esquerda; barra superior fixa com saudação, data e relógio; conteúdo com largura máxima de 1240 px e respiro de 32/40 px. Formulários em grade automática (colunas de no mínimo 220 px, espaços de 18/20 px); a ação de envio fica numa linha própria no fim do formulário, alinhada à direita. Abaixo de 960 px o menu vira gaveta aberta pelo botão "Menu"; abaixo de 600 px os botões de envio ocupam a largura toda e as tabelas rolam para o lado com a coluna de ações fixa à direita.

## Elevation & Depth

Quase plano: profundidade por camadas de tom (menu, fundo, cartão branco) e bordas de 1 px. Sombras suaves, sempre com deslocamento e desfoque.

### Shadow Vocabulary
- **Cartão** (`box-shadow: 0 1px 2px rgba(43,42,38,.05), 0 2px 8px rgba(43,42,38,.04)`): cartões de conteúdo.
- **Item ativo** (`box-shadow: 0 1px 2px rgba(43,42,38,.08), 0 0 0 1px #e7e5e0`): item selecionado do menu.
- **Gaveta / Login** (`box-shadow: 0 10px 40px rgba(43,42,38,.18)` / `0 12px 32px rgba(43,42,38,.08)`): menu em gaveta e cartão de login.

## Shapes

Cantos suaves e consistentes: etiquetas 6 px, campos 8 px, itens de menu 10 px, cartões 12 px, botões e contadores em pílula (999 px). Bordas de 1 px; nenhuma faixa colorida lateral.

## Components

### Buttons
- **Shape:** pílula (999px), altura 44 px (36 px no tamanho pequeno).
- **Primary:** fundo #1351b4, texto branco, 0 24px, negrito 16 px.
- **Hover / Focus:** fundo #0c3d8c; foco com contorno âmbar #c2850c de 3 px.
- **Secondary:** fundo branco, texto e borda na cor de marca; hover com fundo #e8effa.
- **Perigo (Excluir/Remover):** texto vermelho sem borda; hover com fundo #fdeeec.

### Chips (etiquetas)
- **Style:** fundo suave + texto escuro da mesma família, 14 px negrito, cantos de 6 px.
- **Contador "pessoas no Lar":** pílula verde com ponto; cinza quando ninguém está no Lar.

### Cards / Containers
- **Corner Style:** 12 px. **Background:** branco. **Border:** 1 px #e7e5e0. **Internal Padding:** 24 px (20/16 px no celular).

### Inputs / Fields
- **Style:** borda 1 px #8d8a83, fundo branco, cantos de 8 px, altura 44 px, texto 16 px.
- **Focus:** borda na cor de marca + halo #e8effa de 3 px.
- **Error:** borda #b42318 e mensagem em negrito logo abaixo.

### Navigation
- Itens de 46 px com ícone de traço, agrupados em Portaria / Cadastros / Histórico.
- Ativo: fundo branco, negrito, ícone na cor de marca, sombra leve. Hover: #e9e7e1.
- Celular e tablet: gaveta deslizante com véu escuro.

### Opções de objetivo (assinatura)
Três opções grandes (80 px) com ícone em quadro de 44 px; a marcada ganha borda e fundo de marca suave e o ícone passa a branco sobre a cor de marca.

### Linha recém-registrada (assinatura)
A pessoa que acabou de entrar acende em #e8effa em "Presentes agora" e esmaece em 3,2 s (desligado com movimento reduzido).

## Do's and Don'ts

### Do:
- **Do** usar a cor de marca só em ação e seleção (A Regra da Cor que Age).
- **Do** manter campos e botões com 44 px de altura e texto de no mínimo 14 px.
- **Do** colocar a ação de envio no fim do formulário, à direita.
- **Do** mostrar objetivo e perfil como etiquetas coloridas.
- **Do** trocar `--marca`, `--marca-forte`, `--marca-suave` e `--marca-borda` pela cor do logotipo do LSVP quando ele chegar.

### Don't:
- **Don't** fazer a interface parecer "sistema frio de empresa" (pedido da equipe): nada de cinza azulado, grade densa ou cartões de indicadores.
- **Don't** usar faixas coloridas laterais em itens, cartões ou mensagens.
- **Don't** usar caracteres de texto ou emoji como ícones; os ícones são SVG de traço.
- **Don't** inventar logotipo ou cores "oficiais" do LSVP.
