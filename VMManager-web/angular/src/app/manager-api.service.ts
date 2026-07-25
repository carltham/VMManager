import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from './api-base';
import { ActionResult, ConnectionItem, ManagerOverview, VmItem } from './manager.models';

@Injectable({ providedIn: 'root' })
export class ManagerApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/manager`;

  getOverview(): Observable<ManagerOverview> {
    return this.http.get<ManagerOverview>(this.baseUrl);
  }

  toggleStats(): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.baseUrl}/stats/toggle`, {});
  }

  addConnection(name: string, uri: string): Observable<ConnectionItem> {
    return this.http.post<ConnectionItem>(`${this.baseUrl}/connections`, { name, uri });
  }

  createVm(connectionId: number, name: string): Observable<VmItem> {
    return this.http.post<VmItem>(`${this.baseUrl}/vms`, { connectionId, name });
  }

  openVm(vmId: number): Observable<VmItem> {
    return this.http.post<VmItem>(`${this.baseUrl}/vms/${vmId}/open`, {});
  }

  runVm(vmId: number): Observable<VmItem> {
    return this.http.post<VmItem>(`${this.baseUrl}/vms/${vmId}/run`, {});
  }

  pauseVm(vmId: number): Observable<VmItem> {
    return this.http.post<VmItem>(`${this.baseUrl}/vms/${vmId}/pause`, {});
  }

  shutdownVm(vmId: number): Observable<VmItem> {
    return this.http.post<VmItem>(`${this.baseUrl}/vms/${vmId}/shutdown`, {});
  }

  deleteVm(vmId: number): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${this.baseUrl}/vms/${vmId}`);
  }
}
