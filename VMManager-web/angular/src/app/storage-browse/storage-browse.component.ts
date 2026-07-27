import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StorageBrowseApiService } from './storage-browse-api.service';
import { StorageBrowseView } from './storage-browse.models';

@Component({
  selector: 'app-storage-browse',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './storage-browse.component.html',
  styleUrl: './storage-browse.component.css',
})
export class StorageBrowseComponent {
  private readonly api = inject(StorageBrowseApiService);

  view: StorageBrowseView = {
    open: false,
    currentPath: '/',
    entries: ['/', '/var', '/var/lib', '/var/lib/libvirt'],
    selectedPath: '/var/lib/libvirt',
    statusMessage: '',
    errorMessage: '',
  };

  toggleOpen(): void {
    this.view.open = !this.view.open;
    this.view.statusMessage = '';
    this.view.errorMessage = '';
    if (this.view.open) {
      this.openBrowser();
    }
  }

  openBrowser(): void {
    this.api.open().subscribe({
      next: (result) => {
        this.view = result;
      },
      error: () => {
        this.view.statusMessage = 'Unable to open storage browser.';
      },
    });
  }

  select(entry: string): void {
    this.view.selectedPath = entry;
    this.view.errorMessage = '';
    this.api.selectPath(entry).subscribe({
      next: (result) => {
        this.view = result;
      },
      error: () => {
        this.view.errorMessage = 'Failed to select path.';
      },
    });
  }

  confirm(): void {
    this.api.confirmPath(this.view.selectedPath).subscribe({
      next: (result) => {
        this.view = result;
        this.view.statusMessage = `Selected ${this.view.selectedPath}.`;
      },
      error: () => {
        this.view.errorMessage = 'Failed to confirm path.';
      },
    });
  }

  cancel(): void {
    this.view.open = false;
  }
}
