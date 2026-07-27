import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { DeleteVmDialogView } from './delete-vm.models';

@Injectable({ providedIn: 'root' })
export class DeleteVmApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/delete-vm`;

  open(vmId: number): Observable<DeleteVmDialogView> {
    return this.http.post<DeleteVmDialogView>(`${this.baseUrl}/open`, {}, { params: { vmId } });
  }

  close(dialogId: number): Observable<DeleteVmDialogView> {
    return this.http.post<DeleteVmDialogView>(`${this.baseUrl}/${dialogId}/close`, {});
  }

  toggleRemoveStorage(dialogId: number, value: boolean): Observable<DeleteVmDialogView> {
    return this.http.post<DeleteVmDialogView>(`${this.baseUrl}/${dialogId}/toggle-remove-storage`, { value });
  }

  confirmDelete(dialogId: number): Observable<DeleteVmDialogView> {
    return this.http.post<DeleteVmDialogView>(`${this.baseUrl}/${dialogId}/confirm-delete`, {});
  }

  cancelDelete(dialogId: number): Observable<DeleteVmDialogView> {
    return this.http.post<DeleteVmDialogView>(`${this.baseUrl}/${dialogId}/cancel-delete`, {});
  }
}