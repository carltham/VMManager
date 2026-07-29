import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConnectionItem, ManagerOverview, VmItem } from './manager.models';

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
  @Output() openCreateVmWizard = new EventEmitter<number>();
  @Output() openVm = new EventEmitter<VmItem>();
  @Output() runVm = new EventEmitter<VmItem>();
  @Output() pauseVm = new EventEmitter<VmItem>();
  @Output() shutdownVm = new EventEmitter<VmItem>();
  @Output() migrateVm = new EventEmitter<VmItem>();
  @Output() deleteVm = new EventEmitter<VmItem>();
  @Output() openCloneWizard = new EventEmitter<void>();
  @Output() openCreateNetworkWizard = new EventEmitter<void>();
  @Output() connectConnection = new EventEmitter<number>();
  @Output() disconnectConnection = new EventEmitter<number>();

  connectionName = '';
  connectionUri = 'qemu:///system';
  selectedConnectionId: number | null = null;
  selectedVmId: number | null = null;
  showConnectionForm = false;
  contextMenu: { vm: VmItem; x: number; y: number } | null = null;
  connectionContextMenu: { connection: ConnectionItem; x: number; y: number } | null = null;

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
    this.showConnectionForm = false;
  }

  onCreateVm(): void {
    if (this.selectedConnectionId == null) {
      return;
    }
    this.openCreateVmWizard.emit(this.selectedConnectionId);
  }

  onOpenCloneWizard(): void {
    this.openCloneWizard.emit();
  }

  onOpenCreateNetworkWizard(): void {
    this.openCreateNetworkWizard.emit();
  }

  selectVm(vm: VmItem): void {
    this.selectedVmId = vm.id;
  }

  openVmContextMenu(event: MouseEvent, vm: VmItem): void {
    event.preventDefault();
    this.selectedVmId = vm.id;
    this.connectionContextMenu = null;
    this.contextMenu = { vm, x: event.clientX, y: event.clientY };
  }

  openConnectionContextMenu(event: MouseEvent, connection: ConnectionItem): void {
    event.preventDefault();
    this.contextMenu = null;
    this.connectionContextMenu = { connection, x: event.clientX, y: event.clientY };
  }

  runConnectionContextAction(action: 'new' | 'connect' | 'disconnect'): void {
    const connection = this.connectionContextMenu?.connection;
    if (!connection) {
      return;
    }

    this.connectionContextMenu = null;
    if (action === 'new') {
      this.selectedConnectionId = connection.id;
      this.onCreateVm();
    } else if (action === 'connect') {
      this.connectConnection.emit(connection.id);
    } else {
      this.disconnectConnection.emit(connection.id);
    }
  }

  runContextAction(
    action: 'open' | 'run' | 'pause' | 'shutdown' | 'clone' | 'migrate' | 'delete',
  ): void {
    const vm = this.contextMenu?.vm;
    if (!vm) {
      return;
    }

    this.contextMenu = null;
    switch (action) {
      case 'open':
        this.openVm.emit(vm);
        break;
      case 'run':
        this.runVm.emit(vm);
        break;
      case 'pause':
        this.pauseVm.emit(vm);
        break;
      case 'shutdown':
        this.shutdownVm.emit(vm);
        break;
      case 'clone':
        this.openCloneWizard.emit();
        break;
      case 'migrate':
        this.migrateVm.emit(vm);
        break;
      case 'delete':
        this.deleteVm.emit(vm);
        break;
    }
  }

  @HostListener('document:click')
  closeVmContextMenu(): void {
    this.contextMenu = null;
    this.connectionContextMenu = null;
  }

  @HostListener('document:keydown.escape')
  closeVmContextMenuOnEscape(): void {
    this.contextMenu = null;
    this.connectionContextMenu = null;
  }

  vmCount(vms: VmItem[]): number {
    return vms.length;
  }
}
