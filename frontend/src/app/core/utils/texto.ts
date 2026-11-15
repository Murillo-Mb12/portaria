/** Remove acentos e deixa minúsculo: "Graças " -> "gracas" */
export function normalizar(texto: string): string {
  // NFD separa a letra do acento ("ç" vira "c" + cedilha); \p{M} são justamente essas marcas de acento
  return texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

/**
 * Busca usada nas listas e tabelas: ignora acentos e maiúsculas e procura em vários textos de uma vez.
 * Ex.: contem('jose', morador.nome, morador.unidade)
 */
export function contem(termo: string, ...textos: (string | null | undefined)[]): boolean {
  const t = normalizar(termo);
  return !t || normalizar(textos.filter(Boolean).join(' ')).includes(t);
}
