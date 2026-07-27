import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ManagerOverview, VmItem } from './manager.models';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css',
})
export class ManagerComponent implements OnChanges {
  @Input() overview: ManagerOverview | null = null;
  @Input() initialConnectionId: number | null = null;

  @Output() refresh = new EventEmitter<void>();
  @Output() toggleStats = new EventEmitter<void>();
  @Output() addConnection = new EventEmitter<{ name: string; uri: string }>();
  @Output() createVm = new EventEmitter<{ connectionId: number; name: string }>();
  @Output() openVm = new EventEmitter<VmItem>();
  @Output() runVm = new EventEmitter<VmItem>();
  @Output() pauseVm = new EventEmitter<VmItem>();
  @Output() shutdownVm = new EventEmitter<VmItem>();
  @Output() migrateVm = new EventEmitter<VmItem>();
  @Output() deleteVm = new EventEmitter<VmItem>();

  connectionName = '';
  connectionUri = 'qemu:///system';
  vmName = '';
  selectedConnectionId: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialConnectionId'] && this.selectedConnectionId === null) {
      this.selectedConnectionId = this.initialConnectionId;
    }

    if (this.selectedConnectionId === null && this.overview?.connections.length) {
      this.selectedConnectionId = this.overview.connections[0].id;
    }
  }

  onAddConnection(): void {
    this.addConnection.emit({ name: this.connectionName, uri: this.connectionUri });
    this.connectionName = '';
  }

  onCreateVm(): void {
    if (this.selectedConnectionId == null) {
      return;
    }
    this.createVm.emit({ connectionId: this.selectedConnectionId, name: this.vmName });
    this.vmName = '';
  }

  vmCount(vms: VmItem[]): number {
    return vms.length;
  }
}
