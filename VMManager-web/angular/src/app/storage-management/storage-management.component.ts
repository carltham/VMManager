import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StorageManagementApiService } from './storage-management-api.service';
import {
  StorageManagementView,
  StoragePoolCreateRequest,
  StorageVolumeCreateRequest,
} from './storage-management.models';

@Component({
  selector: 'app-storage-management',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './storage-management.component.html',
  styleUrl: './storage-management.component.css',
})
export class StorageManagementComponent implements OnInit {
  private readonly api = inject(StorageManagementApiService);

  view: StorageManagementView = { pools: [], volumes: [], currentPath: '' };
  pool: StoragePoolCreateRequest = {
    name: 'new-pool',
    type: 'dir',
    target: '/var/lib/libvirt/images',
  };
  volume: StorageVolumeCreateRequest = {
    name: 'new-volume.qcow2',
    pool: 'default',
    format: 'qcow2',
    sizeGb: 20,
  };

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.api.open().subscribe((view) => {
      this.view = view;
    });
  }

  poolAction(action: 'start' | 'stop' | 'delete', id: number): void {
    this.api.poolAction(action, id).subscribe((view) => {
      this.view = view;
    });
  }

  createPool(): void {
    this.api.createPool(this.pool).subscribe((view) => {
      this.view = view;
    });
  }

  createVolume(): void {
    this.api.createVolume(this.volume).subscribe((view) => {
      this.view = view;
    });
  }
}
