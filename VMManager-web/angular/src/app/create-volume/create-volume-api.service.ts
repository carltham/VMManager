import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { CreateVolumeView } from './create-volume.models';

@Injectable({ providedIn: 'root' })
export class CreateVolumeApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/storage/volumes`;

  createVolume(payload: {
    name: string;
    pool: string;
    format: string;
    sizeGb: number;
    path: string;
  }): Observable<CreateVolumeView> {
    return this.http.post<CreateVolumeView>(`${this.baseUrl}/create`, payload);
  }

  getPools(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/pools`);
  }
}
