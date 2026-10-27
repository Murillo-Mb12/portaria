import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AcessoResponse, EntradaRequest, FiltroAcesso } from '../models';

@Injectable({ providedIn: 'root' })
export class AcessoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/acessos`;

  // Consulta / relatório: só envia os filtros preenchidos
  getAll(filtro: FiltroAcesso = {}): Observable<AcessoResponse[]> {
    let params = new HttpParams();
    if (filtro.busca?.trim()) params = params.set('busca', filtro.busca.trim());
    if (filtro.de) params = params.set('de', filtro.de);
    if (filtro.ate) params = params.set('ate', filtro.ate);
    return this.http.get<AcessoResponse[]>(this.url, { params });
  }

  getPresentes(): Observable<AcessoResponse[]> {
    return this.http.get<AcessoResponse[]>(`${this.url}/presentes`);
  }

  registrarEntrada(entrada: EntradaRequest): Observable<AcessoResponse> {
    return this.http.post<AcessoResponse>(`${this.url}/entrada`, entrada);
  }

  registrarSaida(id: number): Observable<AcessoResponse> {
    return this.http.put<AcessoResponse>(`${this.url}/${id}/saida`, {});
  }
}
