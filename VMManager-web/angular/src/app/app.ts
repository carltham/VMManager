import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { CloneVmApiService } from './clone-vm/clone-vm-api.service';
import { CloneVmComponent } from './clone-vm/clone-vm.component';
import { CloneVmDialogView } from './clone-vm/clone-vm.models';
import { CreateVmApiService } from './create-vm/create-vm-api.service';
import { CreateVmComponent } from './create-vm/create-vm.component';
import { CreateVmWizardView } from './create-vm/create-vm.models';
import { ManagerApiService } from './manager/manager-api.service';
import { ManagerComponent } from './manager/manager.component';
import { ConnectionItem, ManagerOverview, VmItem } from './manager/manager.models';
import { VmDetailsApiService } from './vm-details/vm-details-api.service';
import { VmDetailsComponent } from './vm-details/vm-details.component';
import { VmDetailsView } from './vm-details/vm-details.models';
import { VmWindowApiService } from './vm-window/vm-window-api.service';
import { VmWindowComponent } from './vm-window/vm-window.component';
import { VmWindowTab, VmWindowView } from './vm-window/vm-window.models';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ManagerComponent,
    CreateVmComponent,
    CloneVmComponent,
    VmWindowComponent,
    VmDetailsComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly cloneVmApi = inject(CloneVmApiService);
  private readonly createVmApi = inject(CreateVmApiService);
  private readonly api = inject(ManagerApiService);
  private readonly vmWindowApi = inject(VmWindowApiService);
  private readonly vmDetailsApi = inject(VmDetailsApiService);

  overview: ManagerOverview | null = null;
  isLoading = false;
  error = '';
  infoMessage = '';

  selectedConnectionId: number | null = null;
  createVmWizard: CreateVmWizardView | null = null;
  cloneVmDialog: CloneVmDialogView | null = null;
  vmWindow: VmWindowView | null = null;
  vmDetails: VmDetailsView | null = null;

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

  addConnection(payload: { name: string; uri: string }): void {
    this.error = '';
    this.infoMessage = '';

    this.api.addConnection(payload.name, payload.uri).subscribe({
      next: (connection) => {
        this.infoMessage = `Connection ${connection.name} added.`;
        this.selectedConnectionId = connection.id;
        this.refresh();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to add connection.';
      },
    });
  }

  createVm(payload: { connectionId: number; name: string }): void {
    this.api.createVm(payload.connectionId, payload.name).subscribe({
      next: (vm) => {
        this.infoMessage = `VM ${vm.name} created.`;
        this.refresh();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to create VM.';
      },
    });
  }

  openCreateVmWizard(): void {
    this.createVmApi.open().subscribe({
      next: (wizard) => {
        this.createVmWizard = wizard;
        this.infoMessage = wizard.statusMessage;
      },
      error: () => {
        this.error = 'Failed to open create VM wizard.';
      },
    });
  }

  closeCreateVmWizard(): void {
    this.runCreateVmNoBodyAction('close');
  }

  createVmBack(): void {
    this.runCreateVmNoBodyAction('back');
  }

  createVmNext(): void {
    this.runCreateVmNoBodyAction('next');
  }

  createVmFinish(): void {
    this.runCreateVmNoBodyAction('finish', true);
  }

  createVmChangeConnection(value: number): void {
    this.runCreateVmWithValueAction('connection', value);
  }

  createVmChangeInstallMethod(value: string): void {
    this.runCreateVmWithValueAction('installMethod', value);
  }

  createVmBrowseIso(value: string): void {
    this.runCreateVmWithValueAction('iso', value);
  }

  createVmBrowseUrl(value: string): void {
    this.runCreateVmWithValueAction('url', value);
  }

  createVmBrowseImportSource(value: string): void {
    this.runCreateVmWithValueAction('importSource', value);
  }

  createVmBrowseAppSource(value: string): void {
    this.runCreateVmWithValueAction('appSource', value);
  }

  createVmBrowseOsContainerSource(value: string): void {
    this.runCreateVmWithValueAction('osContainerSource', value);
  }

  createVmToggleDetectOs(value: boolean): void {
    this.runCreateVmWithValueAction('detectOs', value);
  }

  createVmToggleStorage(value: boolean): void {
    this.runCreateVmWithValueAction('storage', value);
  }

  createVmChangeArch(value: string): void {
    this.runCreateVmWithValueAction('arch', value);
  }

  createVmChangeType(value: string): void {
    this.runCreateVmWithValueAction('type', value);
  }

  createVmChangeMachine(value: string): void {
    this.runCreateVmWithValueAction('machine', value);
  }

  createVmEditVmName(value: string): void {
    this.runCreateVmWithValueAction('vmName', value);
  }

  openCloneVmDialog(): void {
    this.cloneVmApi.open().subscribe({
      next: (dialog) => {
        this.cloneVmDialog = dialog;
        this.infoMessage = dialog.statusMessage;
      },
      error: () => {
        this.error = 'Failed to open clone VM dialog.';
      },
    });
  }

  closeCloneVmDialog(): void {
    this.runCloneVmNoBodyAction('close');
  }

  selectCloneSourceVm(value: number): void {
    this.runCloneVmWithValueAction('sourceVm', value);
  }

  chooseCloneMode(value: string): void {
    this.runCloneVmWithValueAction('mode', value);
  }

  browseCloneDestination(value: string): void {
    this.runCloneVmWithValueAction('destination', value);
  }

  changeCloneDiskOptions(value: string): void {
    this.runCloneVmWithValueAction('diskOptions', value);
  }

  editCloneName(value: string): void {
    this.runCloneVmWithValueAction('cloneName', value);
  }

  confirmClone(): void {
    this.runCloneVmNoBodyAction('confirm', true);
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

  openVmDetails(vmId: number): void {
    this.vmDetailsApi.open(vmId).subscribe({
      next: (details) => {
        this.setVmDetails(details);
        this.infoMessage = `Opened details for ${details.vm.name}.`;
      },
      error: () => {
        this.error = 'Failed to open VM details.';
      },
    });
  }

  refreshVmDetails(): void {
    if (!this.vmDetails) {
      return;
    }

    this.vmDetailsApi.refresh(this.vmDetails.vm.id).subscribe({
      next: (details) => this.setVmDetails(details),
      error: () => {
        this.error = 'Failed to refresh details.';
      },
    });
  }

  selectDetailsHardware(hardware: string): void {
    if (!this.vmDetails) {
      return;
    }

    this.vmDetailsApi.selectHardware(this.vmDetails.vm.id, hardware).subscribe({
      next: (details) => this.setVmDetails(details),
      error: () => {
        this.error = 'Failed to select hardware.';
      },
    });
  }

  editGeneralSettings(value: string): void {
    this.runVmDetailsTextAction('general', value);
  }

  editCpuSettings(value: number): void {
    if (!this.vmDetails) {
      return;
    }
    this.vmDetailsApi.editCpu(this.vmDetails.vm.id, value).subscribe({
      next: (details) => this.setVmDetails(details),
      error: () => {
        this.error = 'Failed to edit CPU settings.';
      },
    });
  }

  editMemorySettings(value: number): void {
    if (!this.vmDetails) {
      return;
    }
    this.vmDetailsApi.editMemory(this.vmDetails.vm.id, value).subscribe({
      next: (details) => this.setVmDetails(details),
      error: () => {
        this.error = 'Failed to edit memory settings.';
      },
    });
  }

  editBootSettings(value: string): void {
    this.runVmDetailsTextAction('boot', value);
  }

  addHardwareFromDetails(value: string): void {
    this.runVmDetailsTextAction('addHardware', value);
  }

  removeHardwareFromDetails(value: string): void {
    this.runVmDetailsTextAction('removeHardware', value);
  }

  editStorage(value: string): void {
    this.runVmDetailsTextAction('storage', value);
  }

  editNetwork(value: string): void {
    this.runVmDetailsTextAction('network', value);
  }

  editGraphics(value: string): void {
    this.runVmDetailsTextAction('graphics', value);
  }

  editTpm(value: string): void {
    this.runVmDetailsTextAction('tpm', value);
  }

  editVsock(value: string): void {
    this.runVmDetailsTextAction('vsock', value);
  }

  launchXmlEditor(): void {
    this.runVmDetailsNoBodyAction('xml');
  }

  launchStorageBrowser(): void {
    this.runVmDetailsNoBodyAction('storageBrowser');
  }

  launchOsList(): void {
    this.runVmDetailsNoBodyAction('osList');
  }

  applyDetailsChanges(): void {
    this.runVmDetailsNoBodyAction('apply');
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

  runVmWindowActionFromUi(
    action: 'start' | 'pause' | 'reset' | 'reboot' | 'shutdown' | 'save' | 'status',
  ): void {
    this.runVmWindowAction(action);
  }

  allVms(): VmItem[] {
    return this.overview?.connections.flatMap((connection) => connection.vms) ?? [];
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

  private runCreateVmNoBodyAction(
    action: 'close' | 'back' | 'next' | 'finish',
    refreshAfter = false,
  ): void {
    if (!this.createVmWizard) {
      return;
    }

    let request;
    switch (action) {
      case 'close':
        request = this.createVmApi.close(this.createVmWizard.wizardId);
        break;
      case 'back':
        request = this.createVmApi.back(this.createVmWizard.wizardId);
        break;
      case 'next':
        request = this.createVmApi.next(this.createVmWizard.wizardId);
        break;
      case 'finish':
        request = this.createVmApi.finish(this.createVmWizard.wizardId);
        break;
      default:
        return;
    }

    request.subscribe({
      next: (wizard: CreateVmWizardView) => {
        this.createVmWizard = wizard;
        this.infoMessage = wizard.statusMessage;
        if (refreshAfter) {
          this.refresh();
        }
      },
      error: () => {
        this.error = `Failed to execute ${action} in create VM wizard.`;
      },
    });
  }

  private runCreateVmWithValueAction(
    action:
      | 'connection'
      | 'installMethod'
      | 'iso'
      | 'url'
      | 'importSource'
      | 'appSource'
      | 'osContainerSource'
      | 'detectOs'
      | 'storage'
      | 'arch'
      | 'type'
      | 'machine'
      | 'vmName',
    value: string | number | boolean,
  ): void {
    if (!this.createVmWizard) {
      return;
    }

    let request;
    switch (action) {
      case 'connection':
        request = this.createVmApi.changeConnection(this.createVmWizard.wizardId, Number(value));
        break;
      case 'installMethod':
        request = this.createVmApi.changeInstallMethod(this.createVmWizard.wizardId, String(value));
        break;
      case 'iso':
        request = this.createVmApi.browseIso(this.createVmWizard.wizardId, String(value));
        break;
      case 'url':
        request = this.createVmApi.browseUrl(this.createVmWizard.wizardId, String(value));
        break;
      case 'importSource':
        request = this.createVmApi.browseImportSource(this.createVmWizard.wizardId, String(value));
        break;
      case 'appSource':
        request = this.createVmApi.browseAppSource(this.createVmWizard.wizardId, String(value));
        break;
      case 'osContainerSource':
        request = this.createVmApi.browseOsContainerSource(
          this.createVmWizard.wizardId,
          String(value),
        );
        break;
      case 'detectOs':
        request = this.createVmApi.toggleDetectOs(this.createVmWizard.wizardId, Boolean(value));
        break;
      case 'storage':
        request = this.createVmApi.toggleStorage(this.createVmWizard.wizardId, Boolean(value));
        break;
      case 'arch':
        request = this.createVmApi.changeArch(this.createVmWizard.wizardId, String(value));
        break;
      case 'type':
        request = this.createVmApi.changeType(this.createVmWizard.wizardId, String(value));
        break;
      case 'machine':
        request = this.createVmApi.changeMachine(this.createVmWizard.wizardId, String(value));
        break;
      case 'vmName':
        request = this.createVmApi.editVmName(this.createVmWizard.wizardId, String(value));
        break;
      default:
        return;
    }

    request.subscribe({
      next: (wizard: CreateVmWizardView) => {
        this.createVmWizard = wizard;
        this.infoMessage = wizard.statusMessage;
      },
      error: () => {
        this.error = `Failed to update ${action} in create VM wizard.`;
      },
    });
  }

  private runCloneVmNoBodyAction(action: 'close' | 'confirm', refreshAfter = false): void {
    if (!this.cloneVmDialog) {
      return;
    }

    let request;
    switch (action) {
      case 'close':
        request = this.cloneVmApi.close(this.cloneVmDialog.dialogId);
        break;
      case 'confirm':
        request = this.cloneVmApi.confirmClone(this.cloneVmDialog.dialogId);
        break;
      default:
        return;
    }

    request.subscribe({
      next: (dialog: CloneVmDialogView) => {
        this.cloneVmDialog = dialog;
        this.infoMessage = dialog.statusMessage;
        if (refreshAfter) {
          this.refresh();
        }
      },
      error: () => {
        this.error = `Failed to execute ${action} in clone VM dialog.`;
      },
    });
  }

  private runCloneVmWithValueAction(
    action: 'sourceVm' | 'mode' | 'destination' | 'diskOptions' | 'cloneName',
    value: string | number,
  ): void {
    if (!this.cloneVmDialog) {
      return;
    }

    let request;
    switch (action) {
      case 'sourceVm':
        request = this.cloneVmApi.selectSourceVm(this.cloneVmDialog.dialogId, Number(value));
        break;
      case 'mode':
        request = this.cloneVmApi.chooseCloneMode(this.cloneVmDialog.dialogId, String(value));
        break;
      case 'destination':
        request = this.cloneVmApi.browseDestination(this.cloneVmDialog.dialogId, String(value));
        break;
      case 'diskOptions':
        request = this.cloneVmApi.changeDiskOptions(this.cloneVmDialog.dialogId, String(value));
        break;
      case 'cloneName':
        request = this.cloneVmApi.editCloneName(this.cloneVmDialog.dialogId, String(value));
        break;
      default:
        return;
    }

    request.subscribe({
      next: (dialog: CloneVmDialogView) => {
        this.cloneVmDialog = dialog;
        this.infoMessage = dialog.statusMessage;
      },
      error: () => {
        this.error = `Failed to update ${action} in clone VM dialog.`;
      },
    });
  }

  private runVmDetailsTextAction(
    action:
      | 'general'
      | 'boot'
      | 'addHardware'
      | 'removeHardware'
      | 'storage'
      | 'network'
      | 'graphics'
      | 'tpm'
      | 'vsock',
    value: string,
  ): void {
    if (!this.vmDetails) {
      return;
    }

    let request;
    switch (action) {
      case 'general':
        request = this.vmDetailsApi.editGeneral(this.vmDetails.vm.id, value);
        break;
      case 'boot':
        request = this.vmDetailsApi.editBoot(this.vmDetails.vm.id, value);
        break;
      case 'addHardware':
        request = this.vmDetailsApi.addHardware(this.vmDetails.vm.id, value);
        break;
      case 'removeHardware':
        request = this.vmDetailsApi.removeHardware(this.vmDetails.vm.id, value);
        break;
      case 'storage':
        request = this.vmDetailsApi.editStorage(this.vmDetails.vm.id, value);
        break;
      case 'network':
        request = this.vmDetailsApi.editNetwork(this.vmDetails.vm.id, value);
        break;
      case 'graphics':
        request = this.vmDetailsApi.editGraphics(this.vmDetails.vm.id, value);
        break;
      case 'tpm':
        request = this.vmDetailsApi.editTpm(this.vmDetails.vm.id, value);
        break;
      case 'vsock':
        request = this.vmDetailsApi.editVsock(this.vmDetails.vm.id, value);
        break;
      default:
        return;
    }

    request.subscribe({
      next: (details: VmDetailsView) => this.setVmDetails(details),
      error: () => {
        this.error = `Failed to execute ${action} details action.`;
      },
    });
  }

  private runVmDetailsNoBodyAction(action: 'xml' | 'storageBrowser' | 'osList' | 'apply'): void {
    if (!this.vmDetails) {
      return;
    }

    let request;
    switch (action) {
      case 'xml':
        request = this.vmDetailsApi.launchXmlEditor(this.vmDetails.vm.id);
        break;
      case 'storageBrowser':
        request = this.vmDetailsApi.launchStorageBrowser(this.vmDetails.vm.id);
        break;
      case 'osList':
        request = this.vmDetailsApi.launchOsList(this.vmDetails.vm.id);
        break;
      case 'apply':
        request = this.vmDetailsApi.apply(this.vmDetails.vm.id);
        break;
      default:
        return;
    }

    request.subscribe({
      next: (details: VmDetailsView) => this.setVmDetails(details),
      error: () => {
        this.error = `Failed to execute ${action} action.`;
      },
    });
  }

  private setVmDetails(details: VmDetailsView): void {
    this.vmDetails = details;
    this.infoMessage = details.statusMessage;
  }
}
