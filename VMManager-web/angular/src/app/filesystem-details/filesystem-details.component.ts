import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilesystemDetailsDialogView } from './filesystem-details.models';
@Component({
  selector: 'app-filesystem-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filesystem-details.component.html',
  styleUrl: './filesystem-details.component.css',
})
export class FilesystemDetailsComponent {
  @Input() dialog: FilesystemDetailsDialogView | null = null;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() browseSource = new EventEmitter<string>();
  @Output() editFilesystemPath = new EventEmitter<string>();
  @Output() editTarget = new EventEmitter<string>();
  @Output() apply = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
