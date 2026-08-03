import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { App } from './app';
import { AddHardwareApiService } from './add-hardware/add-hardware-api.service';
import { AddStorageApiService } from './add-storage/add-storage-api.service';
import { CloneVmApiService } from './clone-vm/clone-vm-api.service';
import { CreateNetworkApiService } from './create-network/create-network-api.service';
import { CreateVmApiService } from './create-vm/create-vm-api.service';
import { DeleteVmApiService } from './delete-vm/delete-vm-api.service';
import { FilesystemDetailsApiService } from './filesystem-details/filesystem-details-api.service';
import { GraphicsDetailsApiService } from './graphics-details/graphics-details-api.service';
import { ManagerApiService } from './manager/manager-api.service';
import { MigrateVmApiService } from './migrate-vm/migrate-vm-api.service';
import { NetworkListApiService } from './network-list/network-list-api.service';
import { TpmDetailsApiService } from './tpm-details/tpm-details-api.service';
import { VmDetailsApiService } from './vm-details/vm-details-api.service';
import { VmWindowApiService } from './vm-window/vm-window-api.service';
import { VsockDetailsApiService } from './vsock-details/vsock-details-api.service';

describe('App', () => {
  const managerApiStub: Partial<ManagerApiService> = {
    getOverview: () =>
      of({
        statsEnabled: true,
        connections: [],
      }),
  };

  const vmWindowApiStub: Partial<VmWindowApiService> = {
    open: () =>
      of({
        vm: { id: 1, connectionId: 1, name: 'dev-fedora', state: 'RUNNING', opened: true },
        activeTab: 'CONSOLE',
        statusMessage: 'VM window opened',
        consoleText: 'Console connected',
        detailsText: 'State=RUNNING',
        consoleConnected: true,
        viewerType: 'graphics',
        fullscreen: false,
        keyboardGrabbed: false,
      }),
  };

  const vmDetailsApiStub: Partial<VmDetailsApiService> = {
    open: () =>
      of({
        vm: { id: 1, connectionId: 1, name: 'dev-fedora', state: 'RUNNING', opened: true },
        open: true,
        selectedHardware: 'disk',
        generalSettings: 'dev defaults',
        cpuCount: 2,
        memoryMb: 4096,
        bootOrder: 'disk,network',
        hardwareDevices: ['disk'],
        xmlEditorOpen: false,
        storageBrowserOpen: false,
        osListOpen: false,
        statusMessage: 'Details opened',
      }),
  };

  const createVmApiStub: Partial<CreateVmApiService> = {
    open: () =>
      of({
        wizardId: 1,
        open: true,
        step: 1,
        connectionId: 1,
        availableConnections: ['1:Local QEMU (qemu:///system)'],
        installMethod: 'iso',
        vmName: 'new-vm',
        isoPath: '/var/lib/libvirt/images/example.iso',
        url: 'https://example.org/os',
        importSource: '/images/import.qcow2',
        appSource: '/apps/rootfs',
        osContainerSource: 'docker://registry.example/os:latest',
        detectOs: true,
        storageEnabled: true,
        arch: 'x86_64',
        type: 'kvm',
        machine: 'q35',
        statusMessage: 'Create VM wizard opened',
      }),
  };

  const cloneVmApiStub: Partial<CloneVmApiService> = {
    open: () =>
      of({
        dialogId: 1,
        open: true,
        sourceVmId: 1,
        availableSourceVms: [{ id: 1, connectionId: 1, name: 'dev-fedora', state: 'RUNNING' }],
        cloneMode: 'clone',
        destinationPath: '/var/lib/libvirt/images',
        diskOptions: 'full-copy',
        cloneName: 'dev-fedora-clone',
        statusMessage: 'Clone dialog opened',
      }),
  };

  const deleteVmApiStub: Partial<DeleteVmApiService> = {
    open: () =>
      of({
        dialogId: 1,
        open: true,
        vmId: 1,
        removeStorage: false,
        statusMessage: 'Delete dialog opened',
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: AddHardwareApiService, useValue: {} },
        { provide: AddStorageApiService, useValue: {} },
        { provide: CloneVmApiService, useValue: cloneVmApiStub },
        { provide: CreateNetworkApiService, useValue: {} },
        { provide: CreateVmApiService, useValue: createVmApiStub },
        { provide: DeleteVmApiService, useValue: deleteVmApiStub },
        { provide: FilesystemDetailsApiService, useValue: {} },
        { provide: GraphicsDetailsApiService, useValue: {} },
        { provide: ManagerApiService, useValue: managerApiStub },
        { provide: MigrateVmApiService, useValue: {} },
        { provide: NetworkListApiService, useValue: {} },
        { provide: TpmDetailsApiService, useValue: {} },
        { provide: VmWindowApiService, useValue: vmWindowApiStub },
        { provide: VmDetailsApiService, useValue: vmDetailsApiStub },
        { provide: VsockDetailsApiService, useValue: {} },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render manager heading', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('VM Manager');
  });

  it('should open a delete confirmation dialog for a selected VM', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.deleteVm({ id: 1, connectionId: 1, name: 'dev-fedora', state: 'RUNNING', opened: true });

    expect(app.deleteVmDialog).toEqual(
      jasmine.objectContaining({ dialogId: 1, vmId: 1, open: true, removeStorage: false }),
    );
  });
});
