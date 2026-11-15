/** yyyy-MM-dd no fuso do computador da portaria (o formato dos campos de data e da API). */
export function dataLocal(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Data de N dias atrás, em yyyy-MM-dd. diasAtras(0) é hoje. */
export function diasAtras(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return dataLocal(d);
}

/** Primeiro dia do mês atual, em yyyy-MM-dd. */
export function inicioDoMes(): string {
  const d = new Date();
  return dataLocal(new Date(d.getFullYear(), d.getMonth(), 1));
}

/** "agora", "25 min", "2 h 05 min", "3 d 4 h": tempo entre dois instantes. */
export function duracao(inicio: string | number | Date, fim: string | number | Date): string {
  const minutos = Math.max(0, Math.floor((new Date(fim).getTime() - new Date(inicio).getTime()) / 60_000));
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas} h ${String(minutos % 60).padStart(2, '0')} min`;
  return `${Math.floor(horas / 24)} d ${horas % 24} h`;
}

/** "14/11/2026" a partir de yyyy-MM-dd (sem passar por Date, para não escorregar de fuso). */
export function dataBr(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}
