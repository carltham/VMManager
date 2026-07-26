import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { CloneVmDialogView } from './clone-vm.models';

@Injectable({ providedIn: 'root' })
export class CloneVmApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/clone-vm`;

  open(): Observable<CloneVmDialogView> {
    return this.http.post<CloneVmDialogView>(`${this.baseUrl}/open`, {});
  }

  close(dialogId: number): Observable<CloneVmDialogView> {
    return this.http.post<CloneVmDialogView>(`${this.baseUrl}/${dialogId}/close`, {});
  }

  selectSourceVm(dialogId: number, value: number): Observable<CloneVmDialogView> {
    return this.http.post<CloneVmDialogView>(`${this.baseUrl}/${dialogId}/select-source-vm`, {
      value,
    });
  }

  chooseCloneMode(dialogId: number, value: string): Observable<CloneVmDialogView> {
    return this.http.post<CloneVmDialogView>(`${this.baseUrl}/${dialogId}/choose-clone-mode`, {
      value,
    });
  }

  browseDestination(dialogId: number, value: string): Observable<CloneVmDialogView> {
    return this.http.post<CloneVmDialogView>(`${this.baseUrl}/${dialogId}/browse-destination`, {
      value,
    });
  }

  changeDiskOptions(dialogId: number, value: string): Observable<CloneVmDialogView> {
    return this.http.post<CloneVmDialogView>(`${this.baseUrl}/${dialogId}/change-disk-options`, {
      value,
    });
  }

  editCloneName(dialogId: number, value: string): Observable<CloneVmDialogView> {
    return this.http.post<CloneVmDialogView>(`${this.baseUrl}/${dialogId}/edit-clone-name`, {
      value,
    });
  }

  confirmClone(dialogId: number): Observable<CloneVmDialogView> {
    return this.http.post<CloneVmDialogView>(`${this.baseUrl}/${dialogId}/confirm-clone`, {});
  }
}
