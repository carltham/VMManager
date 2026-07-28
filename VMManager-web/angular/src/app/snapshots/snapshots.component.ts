import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SnapshotNewComponent } from '../snapshot-new/snapshot-new.component';
import { SnapshotsApiService } from './snapshots-api.service';
import { SnapshotsView } from './snapshots.models';

@Component({
  selector: 'app-snapshots',
  standalone: true,
  imports: [CommonModule, FormsModule, SnapshotNewComponent],
  templateUrl: './snapshots.component.html',
  styleUrl: './snapshots.component.css',
})
export class SnapshotsComponent implements OnInit {
  private readonly api = inject(SnapshotsApiService);

  view: SnapshotsView = {
    vms: [],
    selectedVmId: null,
    snapshots: [],
    selectedSnapshotId: null,
    statusMessage: '',
    errorMessage: '',
  };

  ngOnInit(): void {
    this.api.listVms().subscribe({
      next: (vms) => {
        this.view.vms = vms;
        if (this.view.selectedVmId === null && vms.length > 0) {
          this.view.selectedVmId = vms[0].id;
          this.refresh();
        }
      },
      error: () => {
        this.view.errorMessage = 'Failed to load VM list.';
      },
    });
  }

  refresh(): void {
    if (this.view.selectedVmId == null) {
      return;
    }

    this.api.listSnapshots(this.view.selectedVmId).subscribe({
      next: (snapshots) => {
        this.view.snapshots = snapshots;
        this.view.selectedSnapshotId = snapshots[0]?.id ?? null;
      },
      error: () => {
        this.view.errorMessage = 'Failed to load snapshots.';
      },
    });
  }

  createSnapshot(name: string): void {
    if (this.view.selectedVmId == null) {
      return;
    }

    this.api.createSnapshot(this.view.selectedVmId, name).subscribe({
      next: (snapshots) => {
        this.view.snapshots = snapshots;
        this.view.statusMessage = `Snapshot ${name} created.`;
      },
    });
  }

  deleteSelected(): void {
    if (this.view.selectedVmId == null || this.view.selectedSnapshotId == null) {
      return;
    }

    this.api.deleteSnapshot(this.view.selectedVmId, this.view.selectedSnapshotId).subscribe({
      next: (snapshots) => {
        this.view.snapshots = snapshots;
        this.view.selectedSnapshotId = snapshots[0]?.id ?? null;
        this.view.statusMessage = 'Snapshot deleted.';
      },
    });
  }

  revertSelected(): void {
    if (this.view.selectedVmId == null || this.view.selectedSnapshotId == null) {
      return;
    }

    this.api.revertSnapshot(this.view.selectedVmId, this.view.selectedSnapshotId).subscribe({
      next: (snapshots) => {
        this.view.snapshots = snapshots;
        this.view.statusMessage = 'Snapshot reverted.';
      },
    });
  }
}
