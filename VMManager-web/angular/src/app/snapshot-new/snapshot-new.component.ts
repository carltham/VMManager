import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SnapshotNewView } from './snapshot-new.models';

@Component({
  selector: 'app-snapshot-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './snapshot-new.component.html',
  styleUrl: './snapshot-new.component.css',
})
export class SnapshotNewComponent {
  @Output() createSnapshot = new EventEmitter<string>();

  view: SnapshotNewView = {
    name: '',
    statusMessage: '',
    errorMessage: '',
  };

  create(): void {
    this.view.statusMessage = '';
    this.view.errorMessage = '';

    const name = this.view.name.trim();
    if (!name) {
      this.view.errorMessage = 'Snapshot name is required.';
      return;
    }

    this.createSnapshot.emit(name);
    this.view.statusMessage = `Requested snapshot ${name}.`;
    this.view.name = '';
  }
}
