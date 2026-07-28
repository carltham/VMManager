import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ManagerApiService } from '../manager/manager-api.service';
import { ConnectionItem } from '../manager/manager.models';

@Injectable({ providedIn: 'root' })
export class CreateConnectionApiService {
  private readonly managerApi = inject(ManagerApiService);

  listConnections(): Observable<ConnectionItem[]> {
    return this.managerApi.getOverview().pipe(map((overview) => overview.connections));
  }

  createConnection(name: string, uri: string): Observable<ConnectionItem> {
    return this.managerApi.addConnection(name, uri);
  }
}
