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
  private readonly fallbackChoices = [
    { id: 'fedora41', label: 'Fedora 41', family: 'linux' },
    { id: 'ubuntu2404', label: 'Ubuntu 24.04', family: 'linux' },
    { id: 'debian12', label: 'Debian 12', family: 'linux' },
    { id: 'win11', label: 'Windows 11', family: 'windows' },
  ];

  view: OsListView = {
    vms: [],
    selectedVmId: null,
    query: '',
    osChoices: this.fallbackChoices,
    selectedOsId: 'fedora41',
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
        this.loadChoices();
      },
      error: () => {
        this.view.errorMessage = 'Failed to open OS list.';
      },
    });
  }

  filter(): void {
    this.loadChoices();
  }

  apply(): void {
    if (this.view.selectedVmId == null) {
      return;
    }

    const selected = this.view.osChoices.find((choice) => choice.id === this.view.selectedOsId);
    const osName = selected?.label ?? 'Fedora 41';
    this.api.choose(this.view.selectedVmId, osName).subscribe({
      next: (details) => {
        this.view.statusMessage = details.statusMessage;
        this.view.errorMessage = '';
      },
      error: () => {
        this.view.errorMessage = 'Failed to apply OS selection.';
      },
    });
  }

  private loadChoices(): void {
    if (this.view.selectedVmId == null) {
      return;
    }

    this.api.listChoices(this.view.selectedVmId, this.view.query).subscribe({
      next: (result) => {
        this.view.osChoices = result.items.length > 0 ? result.items : this.fallbackChoices;
        if (!this.view.osChoices.find((choice) => choice.id === this.view.selectedOsId)) {
          this.view.selectedOsId = this.view.osChoices[0]?.id ?? 'fedora41';
        }
      },
      error: () => {
        this.view.osChoices = this.fallbackChoices;
        this.view.errorMessage = 'OS list backend unavailable, using defaults.';
      },
    });
  }
}
