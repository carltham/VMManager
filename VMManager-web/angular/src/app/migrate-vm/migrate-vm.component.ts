import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MigrateVmDialogView } from './migrate-vm.models';

@Component({
  selector: 'app-migrate-vm',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './migrate-vm.component.html',
  styleUrl: './migrate-vm.component.css',
})
export class MigrateVmComponent {
  @Input() dialog: MigrateVmDialogView | null = null;

  @Output() closeDialog = new EventEmitter<void>();
  @Output() chooseDestination = new EventEmitter<string>();
  @Output() toggleAddress = new EventEmitter<boolean>();
  @Output() togglePort = new EventEmitter<boolean>();
  @Output() changeMigrationMode = new EventEmitter<string>();
  @Output() editXmlPreview = new EventEmitter<string>();
  @Output() finishMigration = new EventEmitter<void>();
  @Output() cancelMigration = new EventEmitter<void>();
}