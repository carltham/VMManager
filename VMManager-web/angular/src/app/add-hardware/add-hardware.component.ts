import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddHardwareDialogView } from './add-hardware.models';

@Component({ selector: 'app-add-hardware', standalone: true, imports: [FormsModule], templateUrl: './add-hardware.component.html', styleUrl: './add-hardware.component.css' })
export class AddHardwareComponent {
  @Input() dialog: AddHardwareDialogView | null = null;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() selectDeviceType = new EventEmitter<string>();
  @Output() configureDevice = new EventEmitter<string>();
  @Output() validateDevice = new EventEmitter<void>();
  @Output() apply = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}