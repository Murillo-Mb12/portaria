import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MoradorRequest, MoradorResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class MoradorService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/moradores`;

  getAll(): Observable<MoradorResponse[]> {
    return this.http.get<MoradorResponse[]>(this.url);
  }

  getById(id: number): Observable<MoradorResponse> {
    return this.http.get<MoradorResponse>(`${this.url}/${id}`);
  }

  save(morador: MoradorRequest): Observable<MoradorResponse> {
    return this.http.post<MoradorResponse>(this.url, morador);
  }

  update(id: number, morador: MoradorRequest): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, morador);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
