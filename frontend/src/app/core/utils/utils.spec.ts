import { formatarCpf, formatarPlaca, formatarTelefone } from '../../shared/directives/mascara';
import { dataBr, duracao } from './datas';
import { contem, normalizar } from './texto';

// Rodar: npm test
describe('busca de texto', () => {
  it('ignora acentos e maiúsculas', () => {
    expect(normalizar('  José das GRAÇAS ')).toBe('jose das gracas');
    expect(contem('jose', 'José Carlos Pereira')).toBe(true);
    expect(contem('GRACAS', 'Maria das Graças Lima')).toBe(true);
  });

  it('procura em vários campos e aceita campo vazio', () => {
    expect(contem('quarto 07', 'José Carlos', 'Ala São José - Quarto 07', null)).toBe(true);
    expect(contem('kombi', 'José Carlos', undefined)).toBe(false);
  });

  it('busca vazia encontra tudo', () => {
    expect(contem('   ', 'qualquer coisa')).toBe(true);
  });
});

describe('datas', () => {
  it('formata a duração da permanência', () => {
    expect(duracao('2026-11-14T10:00:00', '2026-11-14T10:00:30')).toBe('agora');
    expect(duracao('2026-11-14T10:00:00', '2026-11-14T10:25:00')).toBe('25 min');
    expect(duracao('2026-11-14T10:00:00', '2026-11-14T12:05:00')).toBe('2 h 05 min');
    expect(duracao('2026-11-12T10:00:00', '2026-11-14T14:00:00')).toBe('2 d 4 h');
  });

  it('nunca devolve duração negativa', () => {
    expect(duracao('2026-11-14T12:00:00', '2026-11-14T10:00:00')).toBe('agora');
  });

  it('converte a data para o formato brasileiro', () => {
    expect(dataBr('2026-11-01')).toBe('01/11/2026');
  });
});

describe('máscaras', () => {
  it('CPF', () => {
    expect(formatarCpf('12345678900')).toBe('123.456.789-00');
    expect(formatarCpf('1234')).toBe('123.4');
    expect(formatarCpf('123.456.789-0099')).toBe('123.456.789-00');
  });

  it('telefone fixo e celular', () => {
    expect(formatarTelefone('1532214410')).toBe('(15) 3221-4410');
    expect(formatarTelefone('15998123344')).toBe('(15) 99812-3344');
    expect(formatarTelefone('')).toBe('');
  });

  it('placa antiga e Mercosul', () => {
    expect(formatarPlaca('abc1234')).toBe('ABC-1234');
    expect(formatarPlaca('abc1d23')).toBe('ABC1D23');
    expect(formatarPlaca('1bc')).toBe('BC');
  });
});
