-- =====================================================
-- V5: índices nas chaves estrangeiras.
-- O PostgreSQL não cria índice sozinho para FOREIGN KEY; sem eles, cada
-- "este visitante já está no Lar?" ou "este morador tem acessos?" lê a tabela inteira.
-- As tabelas são pequenas, então a criação é imediata.
-- =====================================================

-- Acessos por visitante, morador e veículo (regras da entrada e bloqueio de exclusão)
CREATE INDEX idx_acesso_visitante ON tbl_acesso (visitante_id);
CREATE INDEX idx_acesso_morador   ON tbl_acesso (morador_id);
CREATE INDEX idx_acesso_veiculo   ON tbl_acesso (veiculo_id);

-- Lado "inverso" das tabelas de vínculo (a chave primária já cobre a primeira coluna)
CREATE INDEX idx_visitante_morador_morador     ON tbl_visitante_morador (morador_id);
CREATE INDEX idx_veiculo_visitante_visitante   ON tbl_veiculo_visitante (visitante_id);
