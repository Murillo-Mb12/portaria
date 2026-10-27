import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { FuncionarioRequest, FuncionarioResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/funcionarios`;

  getAll(): Observable<FuncionarioResponse[]> {
    return this.http.get<FuncionarioResponse[]>(this.url);
  }

  getById(id: number): Observable<FuncionarioResponse> {
    return this.http.get<FuncionarioResponse>(`${this.url}/${id}`);
  }

  save(funcionario: FuncionarioRequest): Observable<FuncionarioResponse> {
    return this.http.post<FuncionarioResponse>(this.url, funcionario);
  }

  update(id: number, funcionario: FuncionarioRequest): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, funcionario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
