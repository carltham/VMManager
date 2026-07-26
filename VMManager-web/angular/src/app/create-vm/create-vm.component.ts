import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConnectionItem } from '../manager/manager.models';
import { CreateVmWizardView } from './create-vm.models';

@Component({
  selector: 'app-create-vm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-vm.component.html',
  styleUrl: './create-vm.component.css',
})
export class CreateVmComponent implements OnChanges {
  @Input() connections: ConnectionItem[] = [];
  @Input() wizard: CreateVmWizardView | null = null;

  @Output() openWizard = new EventEmitter<void>();
  @Output() closeWizard = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() finish = new EventEmitter<void>();
  @Output() changeConnection = new EventEmitter<number>();
  @Output() changeInstallMethod = new EventEmitter<string>();
  @Output() browseIso = new EventEmitter<string>();
  @Output() browseUrl = new EventEmitter<string>();
  @Output() browseImportSource = new EventEmitter<string>();
  @Output() browseAppSource = new EventEmitter<string>();
  @Output() browseOsContainerSource = new EventEmitter<string>();
  @Output() toggleDetectOs = new EventEmitter<boolean>();
  @Output() toggleStorage = new EventEmitter<boolean>();
  @Output() changeArch = new EventEmitter<string>();
  @Output() changeType = new EventEmitter<string>();
  @Output() changeMachine = new EventEmitter<string>();
  @Output() editVmName = new EventEmitter<string>();

  localConnectionId: number | null = null;
  localInstallMethod = 'iso';
  localVmName = 'new-vm';
  localIsoPath = '';
  localUrl = '';
  localImportSource = '';
  localAppSource = '';
  localOsContainerSource = '';
  localDetectOs = true;
  localStorageEnabled = true;
  localArch = 'x86_64';
  localType = 'kvm';
  localMachine = 'q35';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.wizard) {
      this.localConnectionId = this.wizard.connectionId;
      this.localInstallMethod = this.wizard.installMethod;
      this.localVmName = this.wizard.vmName;
      this.localIsoPath = this.wizard.isoPath;
      this.localUrl = this.wizard.url;
      this.localImportSource = this.wizard.importSource;
      this.localAppSource = this.wizard.appSource;
      this.localOsContainerSource = this.wizard.osContainerSource;
      this.localDetectOs = this.wizard.detectOs;
      this.localStorageEnabled = this.wizard.storageEnabled;
      this.localArch = this.wizard.arch;
      this.localType = this.wizard.type;
      this.localMachine = this.wizard.machine;
    } else if (
      changes['connections'] &&
      this.connections.length &&
      this.localConnectionId === null
    ) {
      this.localConnectionId = this.connections[0].id;
    }
  }
}
