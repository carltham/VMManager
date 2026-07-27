import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { CloneVmApiService } from './clone-vm/clone-vm-api.service';
import { CloneVmComponent } from './clone-vm/clone-vm.component';
import { CloneVmDialogView } from './clone-vm/clone-vm.models';
import { AddHardwareApiService } from './add-hardware/add-hardware-api.service';
import { AddHardwareComponent } from './add-hardware/add-hardware.component';
import { AddHardwareDialogView } from './add-hardware/add-hardware.models';
import { AddStorageApiService } from './add-storage/add-storage-api.service';
import { AddStorageComponent } from './add-storage/add-storage.component';
import { AddStorageDialogView } from './add-storage/add-storage.models';
import { FilesystemDetailsApiService } from './filesystem-details/filesystem-details-api.service';
import { FilesystemDetailsComponent } from './filesystem-details/filesystem-details.component';
import { FilesystemDetailsDialogView } from './filesystem-details/filesystem-details.models';
import { GraphicsDetailsApiService } from './graphics-details/graphics-details-api.service';
import { GraphicsDetailsComponent } from './graphics-details/graphics-details.component';
import { GraphicsDetailsDialogView } from './graphics-details/graphics-details.models';
import { TpmDetailsApiService } from './tpm-details/tpm-details-api.service';
import { TpmDetailsComponent } from './tpm-details/tpm-details.component';
import { TpmDetailsDialogView } from './tpm-details/tpm-details.models';
import { VsockDetailsApiService } from './vsock-details/vsock-details-api.service';
import { VsockDetailsComponent } from './vsock-details/vsock-details.component';
import { VsockDetailsDialogView } from './vsock-details/vsock-details.models';
import { CreateNetworkApiService } from './create-network/create-network-api.service';
import { CreateNetworkComponent } from './create-network/create-network.component';
import { CreateNetworkWizardView } from './create-network/create-network.models';
import { NetworkListApiService } from './network-list/network-list-api.service';
import { NetworkListComponent } from './network-list/network-list.component';
import { NetworkListDialogView } from './network-list/network-list.models';
import { HostNetworksComponent } from './host-networks/host-networks.component';
import { StorageManagementComponent } from './storage-management/storage-management.component';
import { CreateVmApiService } from './create-vm/create-vm-api.service';
import { CreateVmComponent } from './create-vm/create-vm.component';
import { CreateVmWizardView } from './create-vm/create-vm.models';
import { DeleteVmApiService } from './delete-vm/delete-vm-api.service';
import { DeleteVmComponent } from './delete-vm/delete-vm.component';
import { DeleteVmDialogView } from './delete-vm/delete-vm.models';
import { ManagerApiService } from './manager/manager-api.service';
import { ManagerComponent } from './manager/manager.component';
import { ConnectionItem, ManagerOverview, VmItem } from './manager/manager.models';
import { MigrateVmApiService } from './migrate-vm/migrate-vm-api.service';
import { MigrateVmComponent } from './migrate-vm/migrate-vm.component';
import { MigrateVmDialogView } from './migrate-vm/migrate-vm.models';
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
    AddHardwareComponent,
    AddStorageComponent,
    FilesystemDetailsComponent,
    GraphicsDetailsComponent,
    TpmDetailsComponent,
    VsockDetailsComponent,
    CreateNetworkComponent,
    NetworkListComponent,
    HostNetworksComponent,
    StorageManagementComponent,
    ManagerComponent,
    CreateVmComponent,
    CloneVmComponent,
    DeleteVmComponent,
    MigrateVmComponent,
    VmWindowComponent,
    VmDetailsComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly cloneVmApi = inject(CloneVmApiService);
  private readonly addHardwareApi = inject(AddHardwareApiService);
  private readonly addStorageApi = inject(AddStorageApiService);
  private readonly filesystemDetailsApi = inject(FilesystemDetailsApiService);
  private readonly graphicsDetailsApi = inject(GraphicsDetailsApiService);
  private readonly tpmDetailsApi = inject(TpmDetailsApiService);
  private readonly vsockDetailsApi = inject(VsockDetailsApiService);
  private readonly createNetworkApi = inject(CreateNetworkApiService);
  private readonly networkListApi = inject(NetworkListApiService);
  private readonly createVmApi = inject(CreateVmApiService);
  private readonly deleteVmApi = inject(DeleteVmApiService);
  private readonly migrateVmApi = inject(MigrateVmApiService);
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
  addHardwareDialog: AddHardwareDialogView | null = null;
  addStorageDialog: AddStorageDialogView | null = null;
  filesystemDetailsDialog: FilesystemDetailsDialogView | null = null;
  graphicsDetailsDialog: GraphicsDetailsDialogView | null = null;
  tpmDetailsDialog: TpmDetailsDialogView | null = null;
  vsockDetailsDialog: VsockDetailsDialogView | null = null;
  createNetworkWizard: CreateNetworkWizardView | null = null;
  networkListDialog: NetworkListDialogView | null = null;
  deleteVmDialog: DeleteVmDialogView | null = null;
  migrateVmDialog: MigrateVmDialogView | null = null;
  vmWindow: VmWindowView | null = null;
  vmDetails: VmDetailsView | null = null;
  activePage: 'manager' | 'create-vm' | 'clone-vm' | 'create-network' | 'host-networks' | 'storage' = 'manager';

  ngOnInit(): void {
    this.refresh();
  }

  setActivePage(page: 'manager' | 'create-vm' | 'clone-vm' | 'create-network' | 'host-networks' | 'storage'): void {
    this.activePage = page;
  }

  showManagerPage(): boolean {
    return this.activePage === 'manager';
  }

  showCreateVmPage(): boolean {
    return this.activePage === 'create-vm';
  }

  showCloneVmPage(): boolean {
    return this.activePage === 'clone-vm';
  }
  showCreateNetworkPage(): boolean { return this.activePage === 'create-network'; }
  showHostNetworksPage(): boolean { return this.activePage === 'host-networks'; }
  showStoragePage(): boolean { return this.activePage === 'storage'; }

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

  openAddHardwareDialog(): void {
    if (!this.vmDetails) return;
    this.addHardwareApi.open(this.vmDetails.vm.id).subscribe({ next: (dialog) => this.setAddHardwareDialog(dialog), error: () => { this.error = 'Failed to open add hardware dialog.'; } });
  }

  updateAddHardware(action: 'type' | 'configuration', value: string): void {
    if (!this.addHardwareDialog) return;
    const request = action === 'type' ? this.addHardwareApi.selectDeviceType(this.addHardwareDialog.dialogId, value) : this.addHardwareApi.configureDevice(this.addHardwareDialog.dialogId, value);
    request.subscribe({ next: (dialog) => this.setAddHardwareDialog(dialog), error: () => { this.error = 'Failed to update hardware configuration.'; } });
  }

  runAddHardwareAction(action: 'close' | 'validate' | 'apply' | 'cancel'): void {
    if (!this.addHardwareDialog) return;
    const id = this.addHardwareDialog.dialogId;
    const request = action === 'close' ? this.addHardwareApi.close(id) : action === 'validate' ? this.addHardwareApi.validateDevice(id) : action === 'apply' ? this.addHardwareApi.apply(id) : this.addHardwareApi.cancel(id);
    request.subscribe({ next: (dialog) => this.setAddHardwareDialog(dialog), error: () => { this.error = `Failed to ${action} hardware configuration.`; } });
  }

  openAddStorageDialog(): void { if (!this.vmDetails) return; this.addStorageApi.open(this.vmDetails.vm.id).subscribe({next:(dialog)=>this.setAddStorageDialog(dialog),error:()=>{this.error='Failed to open add storage dialog.';}}); }
  updateAddStorage(action:'source'|'path'|'format'|'size',value:string|number):void { if(!this.addStorageDialog)return;const id=this.addStorageDialog.dialogId;const request=action==='source'?this.addStorageApi.browseSource(id,String(value)):action==='path'?this.addStorageApi.selectStoragePath(id,String(value)):action==='format'?this.addStorageApi.changeFormat(id,String(value)):this.addStorageApi.changeSize(id,Number(value));request.subscribe({next:(dialog)=>this.setAddStorageDialog(dialog),error:()=>{this.error='Failed to update storage configuration.';}}); }
  runAddStorageAction(action:'close'|'attach'|'cancel'):void {if(!this.addStorageDialog)return;const id=this.addStorageDialog.dialogId;const request=action==='close'?this.addStorageApi.close(id):action==='attach'?this.addStorageApi.attachStorage(id):this.addStorageApi.cancel(id);request.subscribe({next:(dialog)=>this.setAddStorageDialog(dialog),error:()=>{this.error=`Failed to ${action} storage.`;}});}
  openFilesystemDetailsDialog():void {if(!this.vmDetails)return;this.filesystemDetailsApi.open(this.vmDetails.vm.id).subscribe({next:(dialog)=>this.setFilesystemDetailsDialog(dialog),error:()=>{this.error='Failed to open filesystem details.';}});}
  updateFilesystemDetails(action:'path'|'target',value:string):void {if(!this.filesystemDetailsDialog)return;const id=this.filesystemDetailsDialog.dialogId;const request=action==='path'?this.filesystemDetailsApi.editFilesystemPath(id,value):this.filesystemDetailsApi.editTarget(id,value);request.subscribe({next:(dialog)=>this.setFilesystemDetailsDialog(dialog),error:()=>{this.error='Failed to update filesystem details.';}});}
  runFilesystemDetailsAction(action:'close'|'apply'|'cancel'):void {if(!this.filesystemDetailsDialog)return;const id=this.filesystemDetailsDialog.dialogId;const request=action==='close'?this.filesystemDetailsApi.close(id):action==='apply'?this.filesystemDetailsApi.apply(id):this.filesystemDetailsApi.cancel(id);request.subscribe({next:(dialog)=>this.setFilesystemDetailsDialog(dialog),error:()=>{this.error=`Failed to ${action} filesystem details.`;}});}
  openGraphicsDetailsDialog():void {if(!this.vmDetails)return;this.graphicsDetailsApi.open(this.vmDetails.vm.id).subscribe({next:(dialog)=>this.setGraphicsDetailsDialog(dialog),error:()=>{this.error='Failed to open graphics details.';}});}
  updateGraphicsType(value:string):void {if(!this.graphicsDetailsDialog)return;this.graphicsDetailsApi.changeGraphicsType(this.graphicsDetailsDialog.dialogId,value).subscribe({next:(dialog)=>this.setGraphicsDetailsDialog(dialog),error:()=>{this.error='Failed to update graphics type.';}});}
  updateGraphicsConnection(value:{listenAddress:string;port:number;keymap:string}):void {if(!this.graphicsDetailsDialog)return;this.graphicsDetailsApi.changeListenPortKey(this.graphicsDetailsDialog.dialogId,value.listenAddress,value.port,value.keymap).subscribe({next:(dialog)=>this.setGraphicsDetailsDialog(dialog),error:()=>{this.error='Failed to update graphics connection.';}});}
  runGraphicsDetailsAction(action:'close'|'apply'|'cancel'):void {if(!this.graphicsDetailsDialog)return;const id=this.graphicsDetailsDialog.dialogId;const request=action==='close'?this.graphicsDetailsApi.close(id):action==='apply'?this.graphicsDetailsApi.apply(id):this.graphicsDetailsApi.cancel(id);request.subscribe({next:(dialog)=>this.setGraphicsDetailsDialog(dialog),error:()=>{this.error=`Failed to ${action} graphics details.`;}});}
  openTpmDetailsDialog():void {if(!this.vmDetails)return;this.tpmDetailsApi.open(this.vmDetails.vm.id).subscribe({next:(dialog)=>this.setTpmDetailsDialog(dialog),error:()=>{this.error='Failed to open TPM details.';}});}
  updateTpm(action:'model'|'version'|'path',value:string):void {if(!this.tpmDetailsDialog)return;const id=this.tpmDetailsDialog.dialogId;const request=action==='model'?this.tpmDetailsApi.changeModel(id,value):action==='version'?this.tpmDetailsApi.changeVersion(id,value):this.tpmDetailsApi.changeDevicePath(id,value);request.subscribe({next:(dialog)=>this.setTpmDetailsDialog(dialog),error:()=>{this.error='Failed to update TPM details.';}});}
  runTpmDetailsAction(action:'close'|'apply'|'cancel'):void {if(!this.tpmDetailsDialog)return;const id=this.tpmDetailsDialog.dialogId;const request=action==='close'?this.tpmDetailsApi.close(id):action==='apply'?this.tpmDetailsApi.apply(id):this.tpmDetailsApi.cancel(id);request.subscribe({next:(dialog)=>this.setTpmDetailsDialog(dialog),error:()=>{this.error=`Failed to ${action} TPM details.`;}});}
  openVsockDetailsDialog():void {if(!this.vmDetails)return;this.vsockDetailsApi.open(this.vmDetails.vm.id).subscribe({next:(dialog)=>this.setVsockDetailsDialog(dialog),error:()=>{this.error='Failed to open VSock details.';}});}
  updateVsockAutoCid(value:boolean):void {if(!this.vsockDetailsDialog)return;this.vsockDetailsApi.toggleAutoCid(this.vsockDetailsDialog.dialogId,value).subscribe({next:(dialog)=>this.setVsockDetailsDialog(dialog),error:()=>{this.error='Failed to update VSock mode.';}});}
  updateVsockCid(value:number):void {if(!this.vsockDetailsDialog)return;this.vsockDetailsApi.editCid(this.vsockDetailsDialog.dialogId,value).subscribe({next:(dialog)=>this.setVsockDetailsDialog(dialog),error:()=>{this.error='Failed to update VSock CID.';}});}
  runVsockDetailsAction(action:'close'|'apply'|'cancel'):void {if(!this.vsockDetailsDialog)return;const id=this.vsockDetailsDialog.dialogId;const request=action==='close'?this.vsockDetailsApi.close(id):action==='apply'?this.vsockDetailsApi.apply(id):this.vsockDetailsApi.cancel(id);request.subscribe({next:(dialog)=>this.setVsockDetailsDialog(dialog),error:()=>{this.error=`Failed to ${action} VSock details.`;}});}
  openCreateNetworkWizard():void {this.createNetworkApi.open().subscribe({next:(wizard)=>this.setCreateNetworkWizard(wizard),error:()=>{this.error='Failed to open create network wizard.';}});}
  runCreateNetworkAction(action:'close'|'back'|'next'|'review'|'create'|'cancel'):void {if(!this.createNetworkWizard)return;const id=this.createNetworkWizard.wizardId;const request=action==='close'?this.createNetworkApi.close(id):action==='back'?this.createNetworkApi.back(id):action==='next'?this.createNetworkApi.next(id):action==='review'?this.createNetworkApi.review(id):action==='create'?this.createNetworkApi.create(id):this.createNetworkApi.cancel(id);request.subscribe({next:(wizard)=>this.setCreateNetworkWizard(wizard),error:()=>{this.error=`Failed to ${action} network wizard.`;}});}
  configureNetwork(value:{networkName:string;mode:string}):void {if(!this.createNetworkWizard)return;this.createNetworkApi.configureNetwork(this.createNetworkWizard.wizardId,value.networkName,value.mode).subscribe({next:(wizard)=>this.setCreateNetworkWizard(wizard),error:()=>{this.error='Failed to configure network.';}});}
  setNetworkAddressRange(value:string):void {if(!this.createNetworkWizard)return;this.createNetworkApi.setAddressRange(this.createNetworkWizard.wizardId,value).subscribe({next:(wizard)=>this.setCreateNetworkWizard(wizard),error:()=>{this.error='Failed to set network range.';}});}
  openNetworkListDialog():void {this.networkListApi.open().subscribe({next:(dialog)=>this.setNetworkListDialog(dialog),error:()=>{this.error='Failed to open network list.';}});}
  selectNetwork(value:string):void {if(!this.networkListDialog)return;this.networkListApi.selectNetwork(this.networkListDialog.dialogId,value).subscribe({next:(dialog)=>this.setNetworkListDialog(dialog),error:()=>{this.error='Failed to select network.';}});}
  runNetworkListAction(action:'close'|'confirm'|'cancel'):void {if(!this.networkListDialog)return;const id=this.networkListDialog.dialogId;const request=action==='close'?this.networkListApi.close(id):action==='confirm'?this.networkListApi.confirmSource(id):this.networkListApi.cancel(id);request.subscribe({next:(dialog)=>this.setNetworkListDialog(dialog),error:()=>{this.error=`Failed to ${action} network source.`;}});}

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
    this.deleteVmApi.open(vm.id).subscribe({
      next: (dialog) => {
        this.deleteVmDialog = dialog;
        this.infoMessage = `Confirm deletion of ${vm.name}.`;
      },
      error: () => {
        this.error = 'Failed to open delete VM dialog.';
      },
    });
  }

  openMigrateVmDialog(vm: VmItem): void {
    this.migrateVmApi.open(vm.id).subscribe({
      next: (dialog) => {
        this.migrateVmDialog = dialog;
        this.infoMessage = `Configure migration for ${vm.name}.`;
      },
      error: () => { this.error = 'Failed to open migrate VM dialog.'; },
    });
  }

  closeMigrateVmDialog(): void { this.runMigrateVmAction('close'); }
  cancelMigration(): void { this.runMigrateVmAction('cancel'); }
  finishMigration(): void { this.runMigrateVmAction('finish'); }

  updateMigrationText(action: 'destination' | 'mode' | 'xml', value: string): void {
    if (!this.migrateVmDialog) return;
    const dialogId = this.migrateVmDialog.dialogId;
    const request = action === 'destination' ? this.migrateVmApi.chooseDestination(dialogId, value)
      : action === 'mode' ? this.migrateVmApi.changeMigrationMode(dialogId, value)
        : this.migrateVmApi.editXmlPreview(dialogId, value);
    request.subscribe({ next: (dialog) => this.setMigrateVmDialog(dialog), error: () => { this.error = 'Failed to update migration setting.'; } });
  }

  updateMigrationOption(action: 'address' | 'port', value: boolean): void {
    if (!this.migrateVmDialog) return;
    const request = action === 'address' ? this.migrateVmApi.toggleAddress(this.migrateVmDialog.dialogId, value)
      : this.migrateVmApi.togglePort(this.migrateVmDialog.dialogId, value);
    request.subscribe({ next: (dialog) => this.setMigrateVmDialog(dialog), error: () => { this.error = 'Failed to update migration option.'; } });
  }

  closeDeleteVmDialog(): void {
    this.runDeleteVmAction('close');
  }

  toggleDeleteVmStorage(value: boolean): void {
    if (!this.deleteVmDialog) {
      return;
    }

    this.deleteVmApi.toggleRemoveStorage(this.deleteVmDialog.dialogId, value).subscribe({
      next: (dialog) => {
        this.deleteVmDialog = dialog;
        this.infoMessage = dialog.statusMessage;
      },
      error: () => {
        this.error = 'Failed to update storage deletion option.';
      },
    });
  }

  confirmDeleteVm(): void {
    this.runDeleteVmAction('confirm', true);
  }

  cancelDeleteVm(): void {
    this.runDeleteVmAction('cancel');
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

  private runDeleteVmAction(action: 'close' | 'confirm' | 'cancel', refreshAfter = false): void {
    if (!this.deleteVmDialog) {
      return;
    }

    let request;
    switch (action) {
      case 'close':
        request = this.deleteVmApi.close(this.deleteVmDialog.dialogId);
        break;
      case 'confirm':
        request = this.deleteVmApi.confirmDelete(this.deleteVmDialog.dialogId);
        break;
      case 'cancel':
        request = this.deleteVmApi.cancelDelete(this.deleteVmDialog.dialogId);
        break;
      default:
        return;
    }

    request.subscribe({
      next: (dialog: DeleteVmDialogView) => {
        this.deleteVmDialog = dialog;
        this.infoMessage = dialog.statusMessage;
        if (refreshAfter) {
          this.refresh();
        }
      },
      error: () => {
        this.error = `Failed to ${action} delete VM.`;
      },
    });
  }

  private runMigrateVmAction(action: 'close' | 'finish' | 'cancel'): void {
    if (!this.migrateVmDialog) return;
    const dialogId = this.migrateVmDialog.dialogId;
    const request = action === 'close' ? this.migrateVmApi.close(dialogId)
      : action === 'finish' ? this.migrateVmApi.finishMigration(dialogId)
        : this.migrateVmApi.cancelMigration(dialogId);
    request.subscribe({ next: (dialog) => this.setMigrateVmDialog(dialog), error: () => { this.error = `Failed to ${action} migration.`; } });
  }

  private setMigrateVmDialog(dialog: MigrateVmDialogView): void {
    this.migrateVmDialog = dialog;
    this.infoMessage = dialog.statusMessage;
  }

  private setAddHardwareDialog(dialog: AddHardwareDialogView): void {
    this.addHardwareDialog = dialog;
    this.infoMessage = dialog.statusMessage;
    if (!dialog.open) this.refreshVmDetails();
  }
  private setAddStorageDialog(dialog:AddStorageDialogView):void {this.addStorageDialog=dialog;this.infoMessage=dialog.statusMessage;if(!dialog.open)this.refreshVmDetails();}
  private setFilesystemDetailsDialog(dialog:FilesystemDetailsDialogView):void {this.filesystemDetailsDialog=dialog;this.infoMessage=dialog.statusMessage;if(!dialog.open)this.refreshVmDetails();}
  private setGraphicsDetailsDialog(dialog:GraphicsDetailsDialogView):void {this.graphicsDetailsDialog=dialog;this.infoMessage=dialog.statusMessage;if(!dialog.open)this.refreshVmDetails();}
  private setTpmDetailsDialog(dialog:TpmDetailsDialogView):void {this.tpmDetailsDialog=dialog;this.infoMessage=dialog.statusMessage;if(!dialog.open)this.refreshVmDetails();}
  private setVsockDetailsDialog(dialog:VsockDetailsDialogView):void {this.vsockDetailsDialog=dialog;this.infoMessage=dialog.statusMessage;if(!dialog.open)this.refreshVmDetails();}
  private setCreateNetworkWizard(wizard:CreateNetworkWizardView):void {this.createNetworkWizard=wizard;this.infoMessage=wizard.statusMessage;}
  private setNetworkListDialog(dialog:NetworkListDialogView):void {this.networkListDialog=dialog;this.infoMessage=dialog.statusMessage;if(!dialog.open)this.refreshVmDetails();}

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
