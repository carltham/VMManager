import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { MigrateVmDialogView } from './migrate-vm.models';

@Injectable({ providedIn: 'root' })
export class MigrateVmApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/migrate-vm`;

  open(vmId: number): Observable<MigrateVmDialogView> {
    return this.http.post<MigrateVmDialogView>(`${this.baseUrl}/open`, {}, { params: { vmId } });
  }

  close(dialogId: number): Observable<MigrateVmDialogView> {
    return this.http.post<MigrateVmDialogView>(`${this.baseUrl}/${dialogId}/close`, {});
  }

  chooseDestination(dialogId: number, value: string): Observable<MigrateVmDialogView> {
    return this.postText(dialogId, 'choose-destination', value);
  }

  toggleAddress(dialogId: number, value: boolean): Observable<MigrateVmDialogView> {
    return this.postBoolean(dialogId, 'toggle-address', value);
  }

  togglePort(dialogId: number, value: boolean): Observable<MigrateVmDialogView> {
    return this.postBoolean(dialogId, 'toggle-port', value);
  }

  changeMigrationMode(dialogId: number, value: string): Observable<MigrateVmDialogView> {
    return this.postText(dialogId, 'change-migration-mode', value);
  }

  editXmlPreview(dialogId: number, value: string): Observable<MigrateVmDialogView> {
    return this.postText(dialogId, 'edit-xml-preview', value);
  }

  finishMigration(dialogId: number): Observable<MigrateVmDialogView> {
    return this.http.post<MigrateVmDialogView>(`${this.baseUrl}/${dialogId}/finish-migration`, {});
  }

  cancelMigration(dialogId: number): Observable<MigrateVmDialogView> {
    return this.http.post<MigrateVmDialogView>(`${this.baseUrl}/${dialogId}/cancel-migration`, {});
  }

  private postText(dialogId: number, action: string, value: string): Observable<MigrateVmDialogView> {
    return this.http.post<MigrateVmDialogView>(`${this.baseUrl}/${dialogId}/${action}`, { value });
  }

  private postBoolean(dialogId: number, action: string, value: boolean): Observable<MigrateVmDialogView> {
    return this.http.post<MigrateVmDialogView>(`${this.baseUrl}/${dialogId}/${action}`, { value });
  }
}