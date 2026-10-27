-- =====================================================
-- V3: a entrada passa a ser sempre de uma PESSOA, que pode ou não
-- estar com um veículo (veiculo_id opcional). A coluna "tipo"
-- (PESSOA/VEICULO) deixa de existir.
-- =====================================================

-- Restrições que dependiam da coluna "tipo"
ALTER TABLE tbl_acesso DROP CONSTRAINT ck_acesso_veiculo;
ALTER TABLE tbl_acesso DROP CONSTRAINT ck_acesso_pessoa;

-- Registros antigos de doação/outros feitos só com o veículo podem estar sem nome
UPDATE tbl_acesso SET nome = 'Não informado' WHERE objetivo <> 'VISITA' AND nome IS NULL;

ALTER TABLE tbl_acesso DROP COLUMN tipo;

-- Doação e Outros sempre precisam do nome da pessoa
ALTER TABLE tbl_acesso ADD CONSTRAINT ck_acesso_pessoa CHECK (objetivo = 'VISITA' OR nome IS NOT NULL);
