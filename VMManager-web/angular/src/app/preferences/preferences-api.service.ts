import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';

@Injectable({ providedIn: 'root' })
export class PreferencesApiService {
  private readonly http = inject(HttpClient);

  load(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${API_BASE}/manager/preferences`);
  }
}
