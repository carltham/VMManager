import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OsListApiService } from './os-list-api.service';
import { OsListView } from './os-list.models';

@Component({
  selector: 'app-os-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './os-list.component.html',
  styleUrl: './os-list.component.css',
})
export class OsListComponent implements OnInit {
  private readonly api = inject(OsListApiService);

  view: OsListView = {
    vms: [],
    selectedVmId: null,
    osChoices: ['Fedora 41', 'Ubuntu 24.04', 'Debian 12', 'Windows 11'],
    selectedOs: 'Fedora 41',
    osListOpen: false,
    statusMessage: '',
    errorMessage: '',
  };

  ngOnInit(): void {
    this.api.listVms().subscribe({
      next: (vms) => {
        this.view.vms = vms;
        if (this.view.selectedVmId === null && vms.length > 0) {
          this.view.selectedVmId = vms[0].id;
        }
      },
      error: () => {
        this.view.errorMessage = 'Failed to load VM list.';
      },
    });
  }

  open(): void {
    if (this.view.selectedVmId == null) {
      return;
    }
    this.api.open(this.view.selectedVmId).subscribe({
      next: (details) => {
        this.view.osListOpen = details.osListOpen;
        this.view.statusMessage = details.statusMessage;
        this.view.errorMessage = '';
      },
      error: () => {
        this.view.errorMessage = 'Failed to open OS list.';
      },
    });
  }

  apply(): void {
    if (this.view.selectedVmId == null) {
      return;
    }
    this.api.choose(this.view.selectedVmId, this.view.selectedOs).subscribe({
      next: (details) => {
        this.view.statusMessage = details.statusMessage;
        this.view.errorMessage = '';
      },
      error: () => {
        this.view.errorMessage = 'Failed to apply OS selection.';
      },
    });
  }
}
