import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

import { ManagerApiService } from '../manager/manager-api.service';
import { VmItem } from '../manager/manager.models';
import { VmDetailsApiService } from '../vm-details/vm-details-api.service';
import { VmDetailsView } from '../vm-details/vm-details.models';

@Injectable({ providedIn: 'root' })
export class XmlEditorApiService {
  private readonly managerApi = inject(ManagerApiService);
  private readonly vmDetailsApi = inject(VmDetailsApiService);

  listVms(): Observable<VmItem[]> {
    return this.managerApi
      .getOverview()
      .pipe(map((overview) => overview.connections.flatMap((connection) => connection.vms)));
  }

  open(vmId: number): Observable<VmDetailsView> {
    return this.vmDetailsApi.launchXmlEditor(vmId);
  }

  validate(vmId: number, xml: string) {
    return this.vmDetailsApi.validateXml(vmId, xml);
  }

  save(vmId: number, value: string): Observable<VmDetailsView> {
    return this.vmDetailsApi.editGeneral(vmId, value).pipe(switchMap(() => this.vmDetailsApi.apply(vmId)));
  }
}
