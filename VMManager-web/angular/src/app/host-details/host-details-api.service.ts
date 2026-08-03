import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_BASE } from '../api-base';
import { ManagerApiService } from '../manager/manager-api.service';
import { ConnectionItem } from '../manager/manager.models';
import { HostAutoconnectUpdate, HostDetailsData } from './host-details.models';

@Injectable({ providedIn: 'root' })
export class HostDetailsApiService {
  private readonly http = inject(HttpClient);
  private readonly managerApi = inject(ManagerApiService);

  listConnections(): Observable<ConnectionItem[]> {
    return this.managerApi.getOverview().pipe(map((overview) => overview.connections));
  }

  loadDetails(connectionId: number): Observable<HostDetailsData> {
    return this.http.get<HostDetailsData>(`${API_BASE}/manager/host/${connectionId}`);
  }

  updateAutoconnect(connectionId: number, enabled: boolean): Observable<HostAutoconnectUpdate> {
    return this.http.patch<HostAutoconnectUpdate>(
      `${API_BASE}/manager/connections/${connectionId}/autoconnect`,
      { enabled },
    );
  }
}
