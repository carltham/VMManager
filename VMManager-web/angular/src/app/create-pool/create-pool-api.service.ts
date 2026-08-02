import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { CreatePoolView } from './create-pool.models';

@Injectable({ providedIn: 'root' })
export class CreatePoolApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/storage/pools`;

  createPool(payload: {
    name: string;
    type: string;
    source: string;
    target: string;
  }): Observable<CreatePoolView> {
    return this.http.post<CreatePoolView>(`${this.baseUrl}/create`, {
      id: 0,
      name: payload.name,
      type: payload.type,
      source: payload.source,
      target: payload.target,
    });
  }
}
