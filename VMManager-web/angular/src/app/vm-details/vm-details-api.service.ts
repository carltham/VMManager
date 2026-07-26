import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { VmDetailsView } from './vm-details.models';

@Injectable({ providedIn: 'root' })
export class VmDetailsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/vm-details`;

  open(vmId: number): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/open`, {});
  }

  refresh(vmId: number): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/refresh`, {});
  }

  selectHardware(vmId: number, value: string): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/select-hardware`, { value });
  }

  editGeneral(vmId: number, value: string): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/edit-general`, { value });
  }

  editCpu(vmId: number, value: number): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/edit-cpu`, { value });
  }

  editMemory(vmId: number, value: number): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/edit-memory`, { value });
  }

  editBoot(vmId: number, value: string): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/edit-boot`, { value });
  }

  addHardware(vmId: number, value: string): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/add-hardware`, { value });
  }

  removeHardware(vmId: number, value: string): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/remove-hardware`, { value });
  }

  editStorage(vmId: number, value: string): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/edit-storage`, { value });
  }

  editNetwork(vmId: number, value: string): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/edit-network`, { value });
  }

  editGraphics(vmId: number, value: string): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/edit-graphics`, { value });
  }

  editTpm(vmId: number, value: string): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/edit-tpm`, { value });
  }

  editVsock(vmId: number, value: string): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/edit-vsock`, { value });
  }

  launchXmlEditor(vmId: number): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/launch-xml-editor`, {});
  }

  launchStorageBrowser(vmId: number): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/launch-storage-browser`, {});
  }

  launchOsList(vmId: number): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/launch-os-list`, {});
  }

  apply(vmId: number): Observable<VmDetailsView> {
    return this.http.post<VmDetailsView>(`${this.baseUrl}/${vmId}/apply`, {});
  }
}
