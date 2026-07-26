import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { VmWindowTab, VmWindowView } from './vm-window.models';

@Injectable({ providedIn: 'root' })
export class VmWindowApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/vm-window`;

  open(vmId: number): Observable<VmWindowView> {
    return this.http.post<VmWindowView>(`${this.baseUrl}/${vmId}/open`, {});
  }

  close(vmId: number): Observable<VmWindowView> {
    return this.http.post<VmWindowView>(`${this.baseUrl}/${vmId}/close`, {});
  }

  switchTab(vmId: number, tab: VmWindowTab): Observable<VmWindowView> {
    const params = new HttpParams().set('tab', tab);
    return this.http.post<VmWindowView>(`${this.baseUrl}/${vmId}/switch-tab`, {}, { params });
  }

  start(vmId: number): Observable<VmWindowView> {
    return this.http.post<VmWindowView>(`${this.baseUrl}/${vmId}/start`, {});
  }

  pause(vmId: number): Observable<VmWindowView> {
    return this.http.post<VmWindowView>(`${this.baseUrl}/${vmId}/pause`, {});
  }

  reset(vmId: number): Observable<VmWindowView> {
    return this.http.post<VmWindowView>(`${this.baseUrl}/${vmId}/reset`, {});
  }

  reboot(vmId: number): Observable<VmWindowView> {
    return this.http.post<VmWindowView>(`${this.baseUrl}/${vmId}/reboot`, {});
  }

  shutdown(vmId: number): Observable<VmWindowView> {
    return this.http.post<VmWindowView>(`${this.baseUrl}/${vmId}/shutdown`, {});
  }

  save(vmId: number): Observable<VmWindowView> {
    return this.http.post<VmWindowView>(`${this.baseUrl}/${vmId}/save`, {});
  }

  status(vmId: number): Observable<VmWindowView> {
    return this.http.post<VmWindowView>(`${this.baseUrl}/${vmId}/status`, {});
  }
}
