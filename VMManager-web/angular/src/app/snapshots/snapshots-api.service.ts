import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { ManagerApiService } from '../manager/manager-api.service';
import { VmItem } from '../manager/manager.models';
import { SnapshotItem } from './snapshots.models';

@Injectable({ providedIn: 'root' })
export class SnapshotsApiService {
  private readonly managerApi = inject(ManagerApiService);
  private readonly store = new Map<number, SnapshotItem[]>();
  private seq = 1;

  listVms(): Observable<VmItem[]> {
    return this.managerApi
      .getOverview()
      .pipe(map((overview) => overview.connections.flatMap((connection) => connection.vms)));
  }

  listSnapshots(vmId: number): Observable<SnapshotItem[]> {
    return of(this.store.get(vmId) ?? []);
  }

  createSnapshot(vmId: number, name: string): Observable<SnapshotItem[]> {
    const list = [...(this.store.get(vmId) ?? [])];
    list.unshift({ id: this.seq++, name, createdAt: new Date().toISOString() });
    this.store.set(vmId, list);
    return of(list);
  }

  deleteSnapshot(vmId: number, snapshotId: number): Observable<SnapshotItem[]> {
    const list = (this.store.get(vmId) ?? []).filter((snapshot) => snapshot.id !== snapshotId);
    this.store.set(vmId, list);
    return of(list);
  }

  revertSnapshot(vmId: number, snapshotId: number): Observable<SnapshotItem[]> {
    const list = this.store.get(vmId) ?? [];
    const selected = list.find((snapshot) => snapshot.id === snapshotId);
    if (!selected) {
      return of(list);
    }

    const reordered = [selected, ...list.filter((snapshot) => snapshot.id !== snapshotId)];
    this.store.set(vmId, reordered);
    return of(reordered);
  }
}
