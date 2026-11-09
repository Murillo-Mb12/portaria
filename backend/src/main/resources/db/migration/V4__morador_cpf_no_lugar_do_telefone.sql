-- =====================================================
-- V4: morador passa a ter CPF e deixa de ter telefone.
-- O CPF fica opcional no banco (para não quebrar moradores antigos),
-- mas a API exige CPF em todo cadastro/edição.
-- =====================================================
ALTER TABLE tbl_morador ADD COLUMN cpf VARCHAR(14);
ALTER TABLE tbl_morador DROP COLUMN telefone;
CREATE UNIQUE INDEX uk_morador_cpf ON tbl_morador (cpf);

-- CPFs de exemplo para os moradores do V2 (só se ainda estiverem sem CPF)
UPDATE tbl_morador SET cpf = '111.222.333-44' WHERE nome = 'Benedita Aparecida Rosa' AND cpf IS NULL;
UPDATE tbl_morador SET cpf = '222.333.444-55' WHERE nome = 'José Carlos Pereira'     AND cpf IS NULL;
UPDATE tbl_morador SET cpf = '333.444.555-66' WHERE nome = 'Maria das Graças Lima'   AND cpf IS NULL;
