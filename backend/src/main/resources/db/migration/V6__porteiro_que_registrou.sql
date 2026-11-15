-- Quem registrou cada entrada e cada saída (o computador da portaria é usado por vários porteiros).
-- Guarda o NOME do funcionário no momento do registro (e não só uma referência ao cadastro):
-- assim o histórico continua dizendo quem foi, mesmo que o funcionário seja excluído depois.
-- Registros antigos ficam em branco.
ALTER TABLE tbl_acesso ADD COLUMN entrada_por VARCHAR(100);
ALTER TABLE tbl_acesso ADD COLUMN saida_por   VARCHAR(100);
