import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import {
  StorageManagementView,
  StoragePoolCreateRequest,
  StorageVolumeCreateRequest,
} from './storage-management.models';

@Injectable({ providedIn: 'root' })
export class StorageManagementApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/storage`;

  open(): Observable<StorageManagementView> {
    return this.http.post<StorageManagementView>(`${this.baseUrl}/open`, {});
  }

  poolAction(action: 'start' | 'stop' | 'delete', id: number): Observable<StorageManagementView> {
    return this.http.post<StorageManagementView>(`${this.baseUrl}/pools/${action}`, { id });
  }

  createPool(payload: StoragePoolCreateRequest): Observable<StorageManagementView> {
    return this.http.post<StorageManagementView>(`${this.baseUrl}/pools/create`, {
      id: 0,
      ...payload,
    });
  }

  createVolume(payload: StorageVolumeCreateRequest): Observable<StorageManagementView> {
    return this.http.post<StorageManagementView>(`${this.baseUrl}/volumes/create`, payload);
  }
}
