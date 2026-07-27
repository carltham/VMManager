import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { VmItem } from '../manager/manager.models';
import { VmDetailsView } from './vm-details.models';

@Component({
  selector: 'app-vm-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vm-details.component.html',
  styleUrl: './vm-details.component.css',
})
export class VmDetailsComponent implements OnChanges {
  @Input() allVms: VmItem[] = [];
  @Input() vmDetails: VmDetailsView | null = null;

  @Output() open = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<void>();
  @Output() selectHardware = new EventEmitter<string>();
  @Output() editGeneral = new EventEmitter<string>();
  @Output() editCpu = new EventEmitter<number>();
  @Output() editMemory = new EventEmitter<number>();
  @Output() editBoot = new EventEmitter<string>();
  @Output() openAddHardware = new EventEmitter<void>();
  @Output() openAddStorage = new EventEmitter<void>();
  @Output() openFilesystemDetails = new EventEmitter<void>();
  @Output() openGraphicsDetails = new EventEmitter<void>();
  @Output() openTpmDetails = new EventEmitter<void>();
  @Output() openVsockDetails = new EventEmitter<void>();
  @Output() openNetworkList = new EventEmitter<void>();
  @Output() addHardware = new EventEmitter<string>();
  @Output() removeHardware = new EventEmitter<string>();
  @Output() editStorage = new EventEmitter<string>();
  @Output() editNetwork = new EventEmitter<string>();
  @Output() editGraphics = new EventEmitter<string>();
  @Output() editTpm = new EventEmitter<string>();
  @Output() editVsock = new EventEmitter<string>();
  @Output() launchXml = new EventEmitter<void>();
  @Output() launchStorageBrowser = new EventEmitter<void>();
  @Output() launchOsList = new EventEmitter<void>();
  @Output() applyChanges = new EventEmitter<void>();

  selectedVmId: number | null = null;
  generalSettings = '';
  cpuCount = 2;
  memoryMb = 4096;
  bootOrder = 'disk,network';
  selectedHardware = 'disk';
  editValue = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.vmDetails) {
      this.selectedVmId = this.vmDetails.vm.id;
      this.generalSettings = this.vmDetails.generalSettings;
      this.cpuCount = this.vmDetails.cpuCount;
      this.memoryMb = this.vmDetails.memoryMb;
      this.bootOrder = this.vmDetails.bootOrder;
      this.selectedHardware = this.vmDetails.selectedHardware;
    } else if (changes['allVms'] && this.allVms.length && this.selectedVmId === null) {
      this.selectedVmId = this.allVms[0].id;
    }
  }

  openDetails(): void {
    if (this.selectedVmId != null) {
      this.open.emit(this.selectedVmId);
    }
  }
}
