import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { HostStorageView } from './host-storage.models';

@Injectable({ providedIn: 'root' })
export class HostStorageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/storage`;

  open(): Observable<HostStorageView> {
    return this.http.post<HostStorageView>(`${this.baseUrl}/open`, {});
  }

  action(action: 'start' | 'stop' | 'delete', id: number): Observable<HostStorageView> {
    return this.http.post<HostStorageView>(`${this.baseUrl}/pools/${action}`, { id });
  }
}
