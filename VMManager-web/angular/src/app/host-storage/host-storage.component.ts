import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HostStorageApiService } from './host-storage-api.service';
import { HostStorageView } from './host-storage.models';

@Component({
  selector: 'app-host-storage',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './host-storage.component.html',
  styleUrl: './host-storage.component.css',
})
export class HostStorageComponent {
  private readonly api = inject(HostStorageApiService);

  view: HostStorageView = {
    open: false,
    pools: [],
    volumes: [],
    statusMessage: '',
    errorMessage: '',
  };

  ngOnInit(): void {
    this.open();
  }

  open(): void {
    this.view.open = true;
    this.api.open().subscribe({
      next: (result) => {
        this.view = result;
      },
      error: () => {
        this.view.errorMessage = 'Failed to load host storage.';
      },
    });
  }

  action(action: 'start' | 'stop' | 'delete', id: number): void {
    this.view.errorMessage = '';
    this.view.statusMessage = '';
    this.api.action(action, id).subscribe({
      next: (result) => {
        this.view = result;
      },
      error: (err) => {
        this.view.errorMessage = err?.error?.message ?? `Failed to ${action} pool.`;
      },
    });
  }
}
