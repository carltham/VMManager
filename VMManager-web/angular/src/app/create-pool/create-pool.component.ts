import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CreatePoolApiService } from './create-pool-api.service';
import { CreatePoolView } from './create-pool.models';

@Component({
  selector: 'app-create-pool',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-pool.component.html',
  styleUrl: './create-pool.component.css',
})
export class CreatePoolComponent {
  private readonly api = inject(CreatePoolApiService);

  view: CreatePoolView = {
    open: false,
    name: 'new-pool',
    type: 'dir',
    source: '/var/lib/libvirt/images',
    target: '/var/lib/libvirt/images',
    types: ['dir', 'netfs', 'iscsi', 'rbd'],
    statusMessage: '',
    errorMessage: '',
  };

  toggleOpen(): void {
    this.view.open = !this.view.open;
    this.view.statusMessage = '';
    this.view.errorMessage = '';
  }

  createPool(): void {
    this.view.errorMessage = '';
    this.view.statusMessage = '';

    this.api
      .createPool({
        name: this.view.name,
        type: this.view.type,
        source: this.view.source,
        target: this.view.target,
      })
      .subscribe({
        next: () => {
          this.view.statusMessage = `Pool ${this.view.name} created.`;
        },
        error: (err) => {
          this.view.errorMessage = err?.error?.message ?? err?.message ?? 'Failed to create pool.';
        },
      });
  }

  cancel(): void {
    this.view.open = false;
  }
}
