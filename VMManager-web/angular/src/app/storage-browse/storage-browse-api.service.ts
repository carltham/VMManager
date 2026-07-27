import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { StorageBrowseView } from './storage-browse.models';

@Injectable({ providedIn: 'root' })
export class StorageBrowseApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/storage/browse`;

  open(): Observable<StorageBrowseView> {
    return this.http.post<StorageBrowseView>(`${this.baseUrl}/open`, {});
  }

  selectPath(path: string): Observable<StorageBrowseView> {
    return this.http.post<StorageBrowseView>(`${this.baseUrl}/select`, { path });
  }

  confirmPath(path: string): Observable<StorageBrowseView> {
    return this.http.post<StorageBrowseView>(`${this.baseUrl}/confirm`, { path });
  }
}
