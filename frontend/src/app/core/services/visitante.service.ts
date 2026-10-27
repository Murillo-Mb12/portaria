import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { VisitanteRequest, VisitanteResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class VisitanteService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/visitantes`;

  getAll(): Observable<VisitanteResponse[]> {
    return this.http.get<VisitanteResponse[]>(this.url);
  }

  getById(id: number): Observable<VisitanteResponse> {
    return this.http.get<VisitanteResponse>(`${this.url}/${id}`);
  }

  save(visitante: VisitanteRequest): Observable<VisitanteResponse> {
    return this.http.post<VisitanteResponse>(this.url, visitante);
  }

  update(id: number, visitante: VisitanteRequest): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, visitante);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
