import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-base';
import { FilesystemDetailsDialogView } from './filesystem-details.models';
@Injectable({ providedIn: 'root' })
export class FilesystemDetailsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/filesystem-details`;
  open(vmId: number): Observable<FilesystemDetailsDialogView> {
    return this.http.post<FilesystemDetailsDialogView>(
      `${this.baseUrl}/open`,
      {},
      { params: { vmId } },
    );
  }
  close(id: number): Observable<FilesystemDetailsDialogView> {
    return this.http.post<FilesystemDetailsDialogView>(`${this.baseUrl}/${id}/close`, {});
  }
  browseSource(id: number, value: string): Observable<FilesystemDetailsDialogView> {
    return this.text(id, 'browse-source', value);
  }
  editFilesystemPath(id: number, value: string): Observable<FilesystemDetailsDialogView> {
    return this.text(id, 'edit-filesystem-path', value);
  }
  editTarget(id: number, value: string): Observable<FilesystemDetailsDialogView> {
    return this.text(id, 'edit-target', value);
  }
  apply(id: number): Observable<FilesystemDetailsDialogView> {
    return this.http.post<FilesystemDetailsDialogView>(`${this.baseUrl}/${id}/apply`, {});
  }
  cancel(id: number): Observable<FilesystemDetailsDialogView> {
    return this.http.post<FilesystemDetailsDialogView>(`${this.baseUrl}/${id}/cancel`, {});
  }
  private text(id: number, action: string, value: string): Observable<FilesystemDetailsDialogView> {
    return this.http.post<FilesystemDetailsDialogView>(`${this.baseUrl}/${id}/${action}`, {
      value,
    });
  }
}
