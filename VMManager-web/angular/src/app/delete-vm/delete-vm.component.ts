import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DeleteVmDialogView } from './delete-vm.models';

@Component({
  selector: 'app-delete-vm',
  standalone: true,
  templateUrl: './delete-vm.component.html',
  styleUrl: './delete-vm.component.css',
})
export class DeleteVmComponent {
  @Input() dialog: DeleteVmDialogView | null = null;

  @Output() closeDialog = new EventEmitter<void>();
  @Output() toggleRemoveStorage = new EventEmitter<boolean>();
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancelDelete = new EventEmitter<void>();
}