import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { ConnectionAuthResult } from './connection-auth.models';

@Injectable({ providedIn: 'root' })
export class ConnectionAuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/connection-auth`;

  authenticate(connectionId: number, username: string, password: string, remember: boolean): Observable<ConnectionAuthResult> {
    return this.http.post<ConnectionAuthResult>(`${this.baseUrl}/sessions`, {
      connectionId,
      username,
      password,
      remember,
    });
  }
}
