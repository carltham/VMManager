import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HostDetailsApiService } from './host-details-api.service';
import { HostDetailsView } from './host-details.models';

@Component({
  selector: 'app-host-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './host-details.component.html',
  styleUrl: './host-details.component.css',
})
export class HostDetailsComponent implements OnInit {
  private readonly api = inject(HostDetailsApiService);

  view: HostDetailsView = {
    connections: [],
    selectedConnectionId: null,
    details: null,
    autoConnectEnabled: false,
    statusMessage: '',
    errorMessage: '',
  };

  ngOnInit(): void {
    this.refreshConnections();
  }

  refreshConnections(): void {
    this.api.listConnections().subscribe({
      next: (connections) => {
        this.view.connections = connections;
        if (this.view.selectedConnectionId === null && connections.length > 0) {
          this.view.selectedConnectionId = connections[0].id;
          this.loadDetails();
        }
      },
      error: () => {
        this.view.errorMessage = 'Failed to load connections.';
      },
    });
  }

  loadDetails(): void {
    if (this.view.selectedConnectionId == null) {
      return;
    }

    this.view.errorMessage = '';
    this.api.loadDetails(this.view.selectedConnectionId).subscribe({
      next: (details) => {
        this.view.details = details;
        this.view.autoConnectEnabled = details.autoConnect;
        this.view.statusMessage = `Loaded host details for ${details.connectionName}.`;
      },
      error: () => {
        this.view.errorMessage = 'Failed to load host details.';
      },
    });
  }

  applyAutoconnect(): void {
    if (this.view.selectedConnectionId == null) {
      return;
    }

    this.view.errorMessage = '';
    this.api.updateAutoconnect(this.view.selectedConnectionId, this.view.autoConnectEnabled).subscribe({
      next: (result) => {
        this.view.statusMessage = result.statusMessage;
        if (this.view.details) {
          this.view.details = {
            ...this.view.details,
            autoConnect: result.autoConnect,
          };
        }
      },
      error: () => {
        this.view.errorMessage = 'Failed to update autoconnect setting.';
      },
    });
  }
}
