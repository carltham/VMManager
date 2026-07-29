import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { HostNetworkItem } from './host-networks.models';

@Injectable({ providedIn: 'root' })
export class HostNetworksApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/host-networks`;

  refresh(): Observable<HostNetworkItem[]> {
    return this.http.post<HostNetworkItem[]>(`${this.baseUrl}/refresh`, {});
  }

  start(id: number): Observable<HostNetworkItem> {
    return this.http.post<HostNetworkItem>(`${this.baseUrl}/${id}/start`, {});
  }

  stop(id: number): Observable<HostNetworkItem> {
    return this.http.post<HostNetworkItem>(`${this.baseUrl}/${id}/stop`, {});
  }

  apply(id: number, name: string, autostart: boolean): Observable<HostNetworkItem> {
    return this.http.post<HostNetworkItem>(`${this.baseUrl}/${id}/apply`, { name, autostart });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
