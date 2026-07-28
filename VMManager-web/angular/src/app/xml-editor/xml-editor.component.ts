import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { XmlEditorApiService } from './xml-editor-api.service';
import { XmlEditorView } from './xml-editor.models';

@Component({
  selector: 'app-xml-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './xml-editor.component.html',
  styleUrl: './xml-editor.component.css',
})
export class XmlEditorComponent implements OnInit {
  private readonly api = inject(XmlEditorApiService);

  view: XmlEditorView = {
    vms: [],
    selectedVmId: null,
    xmlText: '<domain/>',
    editorOpen: false,
    statusMessage: '',
    errorMessage: '',
  };

  ngOnInit(): void {
    this.api.listVms().subscribe({
      next: (vms) => {
        this.view.vms = vms;
        if (this.view.selectedVmId === null && vms.length > 0) {
          this.view.selectedVmId = vms[0].id;
        }
      },
      error: () => {
        this.view.errorMessage = 'Failed to load VM list.';
      },
    });
  }

  open(): void {
    if (this.view.selectedVmId == null) {
      return;
    }

    this.api.open(this.view.selectedVmId).subscribe({
      next: (details) => {
        this.view.editorOpen = details.xmlEditorOpen;
        this.view.statusMessage = details.statusMessage;
        this.view.errorMessage = '';
      },
      error: () => {
        this.view.errorMessage = 'Failed to open XML editor.';
      },
    });
  }

  save(): void {
    if (this.view.selectedVmId == null) {
      return;
    }

    this.api.save(this.view.selectedVmId, this.view.xmlText).subscribe({
      next: (details) => {
        this.view.statusMessage = details.statusMessage;
        this.view.errorMessage = '';
      },
      error: () => {
        this.view.errorMessage = 'Failed to save XML changes.';
      },
    });
  }
}
