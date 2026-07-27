import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-base';
import { AddStorageDialogView } from './add-storage.models';
@Injectable({ providedIn: 'root' })
export class AddStorageApiService {
  private readonly http = inject(HttpClient); private readonly baseUrl = `${API_BASE}/add-storage`;
  open(vmId: number): Observable<AddStorageDialogView> { return this.http.post<AddStorageDialogView>(`${this.baseUrl}/open`, {}, { params: { vmId } }); }
  close(id: number): Observable<AddStorageDialogView> { return this.http.post<AddStorageDialogView>(`${this.baseUrl}/${id}/close`, {}); }
  browseSource(id: number, value: string): Observable<AddStorageDialogView> { return this.text(id, 'browse-source', value); }
  selectStoragePath(id: number, value: string): Observable<AddStorageDialogView> { return this.text(id, 'select-storage-path', value); }
  changeFormat(id: number, value: string): Observable<AddStorageDialogView> { return this.text(id, 'change-format', value); }
  changeSize(id: number, value: number): Observable<AddStorageDialogView> { return this.http.post<AddStorageDialogView>(`${this.baseUrl}/${id}/change-size`, { value }); }
  attachStorage(id: number): Observable<AddStorageDialogView> { return this.http.post<AddStorageDialogView>(`${this.baseUrl}/${id}/attach-storage`, {}); }
  cancel(id: number): Observable<AddStorageDialogView> { return this.http.post<AddStorageDialogView>(`${this.baseUrl}/${id}/cancel`, {}); }
  private text(id: number, action: string, value: string): Observable<AddStorageDialogView> { return this.http.post<AddStorageDialogView>(`${this.baseUrl}/${id}/${action}`, { value }); }
}