import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { VmItem } from '../manager/manager.models';
import { CloneVmDialogView } from './clone-vm.models';

@Component({
  selector: 'app-clone-vm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clone-vm.component.html',
  styleUrl: './clone-vm.component.css',
})
export class CloneVmComponent implements OnChanges {
  @Input() allVms: VmItem[] = [];
  @Input() dialog: CloneVmDialogView | null = null;

  @Output() openDialog = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<void>();
  @Output() selectSourceVm = new EventEmitter<number>();
  @Output() chooseCloneMode = new EventEmitter<string>();
  @Output() browseDestination = new EventEmitter<string>();
  @Output() changeDiskOptions = new EventEmitter<string>();
  @Output() editCloneName = new EventEmitter<string>();
  @Output() confirmClone = new EventEmitter<void>();

  localSourceVmId: number | null = null;
  localCloneMode = 'clone';
  localDestinationPath = '/var/lib/libvirt/images';
  localDiskOptions = 'full-copy';
  localCloneName = 'vm-clone';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dialog) {
      this.localSourceVmId = this.dialog.sourceVmId;
      this.localCloneMode = this.dialog.cloneMode;
      this.localDestinationPath = this.dialog.destinationPath;
      this.localDiskOptions = this.dialog.diskOptions;
      this.localCloneName = this.dialog.cloneName;
    } else if (changes['allVms'] && this.allVms.length > 0 && this.localSourceVmId === null) {
      this.localSourceVmId = this.allVms[0].id;
    }
  }
}
