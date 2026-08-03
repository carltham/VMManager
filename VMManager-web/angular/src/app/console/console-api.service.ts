import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ManagerApiService } from '../manager/manager-api.service';
import { VmItem } from '../manager/manager.models';
import { VmWindowApiService } from '../vm-window/vm-window-api.service';
import { VmWindowView } from '../vm-window/vm-window.models';

@Injectable({ providedIn: 'root' })
export class ConsoleApiService {
  private readonly managerApi = inject(ManagerApiService);
  private readonly vmWindowApi = inject(VmWindowApiService);

  listVms(): Observable<VmItem[]> {
    return this.managerApi
      .getOverview()
      .pipe(map((overview) => overview.connections.flatMap((connection) => connection.vms)));
  }

  open(vmId: number): Observable<VmWindowView> {
    return this.vmWindowApi.open(vmId);
  }

  status(vmId: number): Observable<VmWindowView> {
    return this.vmWindowApi.status(vmId);
  }

  pause(vmId: number): Observable<VmWindowView> {
    return this.vmWindowApi.pause(vmId);
  }

  run(vmId: number): Observable<VmWindowView> {
    return this.vmWindowApi.start(vmId);
  }

  connectViewer(vmId: number, viewer: 'graphics' | 'serial'): Observable<VmWindowView> {
    return this.vmWindowApi.connectViewer(vmId, viewer);
  }

  setFullscreen(vmId: number, enabled: boolean): Observable<VmWindowView> {
    return this.vmWindowApi.setFullscreen(vmId, enabled);
  }

  sendKeys(vmId: number, combo: string): Observable<VmWindowView> {
    return this.vmWindowApi.sendKeys(vmId, combo);
  }
}
