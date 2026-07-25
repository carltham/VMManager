import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ManagerApiService } from './manager-api.service';
import { ConnectionItem, ManagerOverview, VmItem } from './manager.models';
import { VmWindowApiService } from './vm-window-api.service';
import { VmWindowTab, VmWindowView } from './vm-window.models';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly api = inject(ManagerApiService);
  private readonly vmWindowApi = inject(VmWindowApiService);

  overview: ManagerOverview | null = null;
  isLoading = false;
  error = '';
  infoMessage = '';

  connectionName = '';
  connectionUri = 'qemu:///system';
  vmName = '';
  selectedConnectionId: number | null = null;
  vmWindow: VmWindowView | null = null;

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.isLoading = true;
    this.error = '';

    this.api.getOverview().subscribe({
      next: (overview) => {
        this.overview = overview;
        if (this.selectedConnectionId === null && overview.connections.length > 0) {
          this.selectedConnectionId = overview.connections[0].id;
        }
      },
      error: () => {
        this.error = 'Could not load manager data. Make sure Spring Boot is running on :18080.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  toggleStats(): void {
    this.api.toggleStats().subscribe({
      next: (result) => {
        this.infoMessage = result.message;
        this.refresh();
      },
      error: () => {
        this.error = 'Failed to toggle stats.';
      },
    });
  }

  addConnection(): void {
    this.error = '';
    this.infoMessage = '';

    this.api.addConnection(this.connectionName, this.connectionUri).subscribe({
      next: (connection) => {
        this.infoMessage = `Connection ${connection.name} added.`;
        this.connectionName = '';
        this.selectedConnectionId = connection.id;
        this.refresh();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to add connection.';
      },
    });
  }

  createVm(): void {
    if (this.selectedConnectionId == null) {
      this.error = 'Select a connection first.';
      return;
    }

    this.api.createVm(this.selectedConnectionId, this.vmName).subscribe({
      next: (vm) => {
        this.infoMessage = `VM ${vm.name} created.`;
        this.vmName = '';
        this.refresh();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to create VM.';
      },
    });
  }

  openVm(vm: VmItem): void {
    this.vmWindowApi.open(vm.id).subscribe({
      next: (windowView) => {
        this.vmWindow = windowView;
        this.infoMessage = `Opened ${vm.name} window.`;
        this.refresh();
      },
      error: () => {
        this.error = 'Failed to open VM window.';
      },
    });
  }

  closeVmWindow(): void {
    if (!this.vmWindow) {
      return;
    }

    this.vmWindowApi.close(this.vmWindow.vm.id).subscribe({
      next: () => {
        this.infoMessage = 'VM window closed.';
        this.vmWindow = null;
      },
      error: () => {
        this.error = 'Failed to close VM window.';
      },
    });
  }

  switchVmWindowTab(tab: VmWindowTab): void {
    if (!this.vmWindow) {
      return;
    }

    this.vmWindowApi.switchTab(this.vmWindow.vm.id, tab).subscribe({
      next: (windowView) => {
        this.vmWindow = windowView;
        this.infoMessage = `Switched to ${tab.toLowerCase()} tab.`;
      },
      error: () => {
        this.error = 'Failed to switch VM tab.';
      },
    });
  }

  startFromVmWindow(): void {
    this.runVmWindowAction('start');
  }

  pauseFromVmWindow(): void {
    this.runVmWindowAction('pause');
  }

  resetFromVmWindow(): void {
    this.runVmWindowAction('reset');
  }

  rebootFromVmWindow(): void {
    this.runVmWindowAction('reboot');
  }

  shutdownFromVmWindow(): void {
    this.runVmWindowAction('shutdown');
  }

  saveFromVmWindow(): void {
    this.runVmWindowAction('save');
  }

  updateVmWindowStatus(): void {
    this.runVmWindowAction('status');
  }

  runVm(vm: VmItem): void {
    this.api.runVm(vm.id).subscribe({
      next: () => {
        this.infoMessage = `Started ${vm.name}.`;
        this.refresh();
      },
      error: () => {
        this.error = 'Failed to run VM.';
      },
    });
  }

  pauseVm(vm: VmItem): void {
    this.api.pauseVm(vm.id).subscribe({
      next: () => {
        this.infoMessage = `Paused ${vm.name}.`;
        this.refresh();
      },
      error: () => {
        this.error = 'Failed to pause VM.';
      },
    });
  }

  shutdownVm(vm: VmItem): void {
    this.api.shutdownVm(vm.id).subscribe({
      next: () => {
        this.infoMessage = `Shut down ${vm.name}.`;
        this.refresh();
      },
      error: () => {
        this.error = 'Failed to shut down VM.';
      },
    });
  }

  deleteVm(vm: VmItem): void {
    this.api.deleteVm(vm.id).subscribe({
      next: () => {
        this.infoMessage = `Deleted ${vm.name}.`;
        this.refresh();
      },
      error: () => {
        this.error = 'Failed to delete VM.';
      },
    });
  }

  vmCount(connection: ConnectionItem): number {
    return connection.vms.length;
  }

  private runVmWindowAction(
    action: 'start' | 'pause' | 'reset' | 'reboot' | 'shutdown' | 'save' | 'status',
  ): void {
    if (!this.vmWindow) {
      return;
    }

    let request;
    switch (action) {
      case 'start':
        request = this.vmWindowApi.start(this.vmWindow.vm.id);
        break;
      case 'pause':
        request = this.vmWindowApi.pause(this.vmWindow.vm.id);
        break;
      case 'reset':
        request = this.vmWindowApi.reset(this.vmWindow.vm.id);
        break;
      case 'reboot':
        request = this.vmWindowApi.reboot(this.vmWindow.vm.id);
        break;
      case 'shutdown':
        request = this.vmWindowApi.shutdown(this.vmWindow.vm.id);
        break;
      case 'save':
        request = this.vmWindowApi.save(this.vmWindow.vm.id);
        break;
      case 'status':
        request = this.vmWindowApi.status(this.vmWindow.vm.id);
        break;
      default:
        return;
    }

    request.subscribe({
      next: (windowView: VmWindowView) => {
        this.vmWindow = windowView;
        this.infoMessage = windowView.statusMessage;
        this.refresh();
      },
      error: () => {
        this.error = `Failed to execute ${action} action.`;
      },
    });
  }
}
