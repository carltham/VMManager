import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-base';
import { AddHardwareDialogView } from './add-hardware.models';

@Injectable({ providedIn: 'root' })
export class AddHardwareApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/add-hardware`;
  open(vmId: number): Observable<AddHardwareDialogView> { return this.http.post<AddHardwareDialogView>(`${this.baseUrl}/open`, {}, { params: { vmId } }); }
  close(id: number): Observable<AddHardwareDialogView> { return this.http.post<AddHardwareDialogView>(`${this.baseUrl}/${id}/close`, {}); }
  selectDeviceType(id: number, value: string): Observable<AddHardwareDialogView> { return this.text(id, 'select-device-type', value); }
  configureDevice(id: number, value: string): Observable<AddHardwareDialogView> { return this.text(id, 'configure-device', value); }
  validateDevice(id: number): Observable<AddHardwareDialogView> { return this.http.post<AddHardwareDialogView>(`${this.baseUrl}/${id}/validate-device`, {}); }
  apply(id: number): Observable<AddHardwareDialogView> { return this.http.post<AddHardwareDialogView>(`${this.baseUrl}/${id}/apply`, {}); }
  cancel(id: number): Observable<AddHardwareDialogView> { return this.http.post<AddHardwareDialogView>(`${this.baseUrl}/${id}/cancel`, {}); }
  private text(id: number, action: string, value: string): Observable<AddHardwareDialogView> { return this.http.post<AddHardwareDialogView>(`${this.baseUrl}/${id}/${action}`, { value }); }
}