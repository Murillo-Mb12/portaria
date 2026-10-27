import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { VeiculoRequest, VeiculoResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/veiculos`;

  getAll(): Observable<VeiculoResponse[]> {
    return this.http.get<VeiculoResponse[]>(this.url);
  }

  getById(id: number): Observable<VeiculoResponse> {
    return this.http.get<VeiculoResponse>(`${this.url}/${id}`);
  }

  save(veiculo: VeiculoRequest): Observable<VeiculoResponse> {
    return this.http.post<VeiculoResponse>(this.url, veiculo);
  }

  update(id: number, veiculo: VeiculoRequest): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, veiculo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
