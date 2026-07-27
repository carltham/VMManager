import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CreateVolumeApiService } from './create-volume-api.service';
import { CreateVolumeView } from './create-volume.models';

@Component({
  selector: 'app-create-volume',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-volume.component.html',
  styleUrl: './create-volume.component.css',
})
export class CreateVolumeComponent {
  private readonly api = inject(CreateVolumeApiService);

  view: CreateVolumeView = {
    open: false,
    name: 'new-volume.qcow2',
    pool: 'default',
    format: 'qcow2',
    sizeGb: 20,
    path: '/var/lib/libvirt/images',
    pools: ['default'],
    statusMessage: '',
    errorMessage: '',
  };

  ngOnInit(): void {
    this.loadPools();
  }

  toggleOpen(): void {
    this.view.open = !this.view.open;
    this.view.statusMessage = '';
    this.view.errorMessage = '';
  }

  loadPools(): void {
    this.api.getPools().subscribe({
      next: (pools) => {
        this.view.pools = pools;
        if (!this.view.pools.includes(this.view.pool)) {
          this.view.pool = this.view.pools[0] ?? this.view.pool;
        }
      },
      error: () => {
        this.view.pools = ['default'];
      },
    });
  }

  browsePath(): void {
    this.view.statusMessage = 'Browse path dialog is not available in this UI yet.';
  }

  createVolume(): void {
    this.view.errorMessage = '';
    this.view.statusMessage = '';

    this.api
      .createVolume({
        name: this.view.name,
        pool: this.view.pool,
        format: this.view.format,
        sizeGb: this.view.sizeGb,
        path: this.view.path,
      })
      .subscribe({
        next: (result) => {
          this.view.statusMessage = `Volume ${result.name} created in pool ${result.pool}.`;
        },
        error: (err) => {
          this.view.errorMessage = err?.error?.message ?? 'Failed to create volume.';
        },
      });
  }

  cancel(): void {
    this.view.open = false;
  }
}
