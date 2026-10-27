-- =====================================================
-- V2: dados de exemplo (Aula 05 - Seeding)
-- Logins: admin / admin123  e  porteiro / 1234
-- As senhas estão gravadas como hash BCrypt.
-- =====================================================

INSERT INTO tbl_funcionario (nome, usuario, senha, perfil) VALUES
  ('Administrador',   'admin',    '$2a$10$AtuZBw5KL7sv1.RUsG5FNOyTF6jjYa07.rPwMod7SDs8.6qVmeDGi', 'ADMINISTRADOR'),
  ('Carlos Porteiro', 'porteiro', '$2a$10$XVVLmXkc8UtNZs2p1007quJXhskKgtrbfbXGBvW1XinCSCIEN4mfq', 'PORTEIRO');

INSERT INTO tbl_morador (nome, unidade, telefone) VALUES
  ('Benedita Aparecida Rosa', 'Ala São José - Quarto 04',    '(15) 3221-4410'),  -- 1
  ('José Carlos Pereira',     'Ala São José - Quarto 07',    '(15) 3221-4411'),  -- 2
  ('Maria das Graças Lima',   'Ala Santa Luzia - Quarto 02', '(15) 3221-4420');  -- 3

INSERT INTO tbl_visitante (nome, documento, telefone, vinculo) VALUES
  ('Ana Paula Rosa',      '123.456.789-00', '(15) 99812-3344', 'FAMILIAR'),  -- 1
  ('Marcos Rosa',         '234.567.890-11', '(15) 99812-5566', 'FAMILIAR'),  -- 2
  ('Ricardo Pereira',     '987.654.321-00', '(15) 99701-2233', 'FAMILIAR'),  -- 3
  ('Juliana Santos',      '456.789.123-11', '(11) 98123-4567', 'CUIDADOR');  -- 4

INSERT INTO tbl_visitante_morador (visitante_id, morador_id) VALUES
  (1, 1), (2, 1),          -- Ana e Marcos visitam a Benedita
  (3, 2),                  -- Ricardo visita o José Carlos
  (4, 2), (4, 3);          -- Juliana é cuidadora do José Carlos e da Maria

INSERT INTO tbl_veiculo (placa, marca, modelo, cor, tipo, responsavel) VALUES
  ('FJK2B31', 'Fiat',       'Uno',    'Prata',    'VISITANTE',   NULL),                       -- 1
  ('LSV0A01', 'Volkswagen', 'Kombi',  'Branco',   'INSTITUICAO', 'Lar São Vicente de Paulo'), -- 2
  ('EQR4521', 'Chevrolet',  'Onix',   'Vermelho', 'VISITANTE',   NULL);                       -- 3

-- O Uno é usado pela Ana e pelo Marcos (mesma família)
INSERT INTO tbl_veiculo_visitante (veiculo_id, visitante_id) VALUES
  (1, 1), (1, 2),
  (3, 3);

-- Histórico de acessos (já encerrados)
INSERT INTO tbl_acesso (tipo, objetivo, visitante_id, morador_id, veiculo_id, nome, documento, finalidade, descricao, entrada, saida) VALUES
  ('PESSOA',  'VISITA', 3,    2,    NULL, NULL, NULL, NULL, NULL,
     LOCALTIMESTAMP(0) - INTERVAL '50' HOUR, LOCALTIMESTAMP(0) - INTERVAL '48' HOUR),
  ('PESSOA',  'DOACAO', NULL, NULL, NULL, 'Supermercado Bom Preço', NULL, NULL, '10 cestas básicas e 20 kg de arroz',
     LOCALTIMESTAMP(0) - INTERVAL '30' HOUR, LOCALTIMESTAMP(0) - INTERVAL '29' HOUR),
  ('PESSOA',  'OUTROS', NULL, NULL, NULL, 'Equipe TV Sorocaba', NULL, 'IMPRENSA', 'Entrevista com a diretoria',
     LOCALTIMESTAMP(0) - INTERVAL '26' HOUR, LOCALTIMESTAMP(0) - INTERVAL '24' HOUR),
  ('VEICULO', 'VISITA', 1,    1,    1,    NULL, NULL, NULL, NULL,
     LOCALTIMESTAMP(0) - INTERVAL '5' HOUR,  LOCALTIMESTAMP(0) - INTERVAL '4' HOUR);
