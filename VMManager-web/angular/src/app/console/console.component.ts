import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConsoleApiService } from './console-api.service';
import { ConsoleView } from './console.models';

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './console.component.html',
  styleUrl: './console.component.css',
})
export class ConsoleComponent implements OnInit {
  private readonly api = inject(ConsoleApiService);

  view: ConsoleView = {
    vms: [],
    selectedVmId: null,
    selectedViewer: 'graphics',
    fullscreenEnabled: false,
    keyCombo: 'Ctrl+Alt+Del',
    window: null,
    statusMessage: '',
    errorMessage: '',
  };

  ngOnInit(): void {
    this.refreshVmList();
  }

  refreshVmList(): void {
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

  openConsole(): void {
    this.runAction('open');
  }

  refreshConsole(): void {
    this.runAction('status');
  }

  runVm(): void {
    this.runAction('run');
  }

  pauseVm(): void {
    this.runAction('pause');
  }

  connectViewer(): void {
    if (this.view.selectedVmId == null) {
      return;
    }
    this.api.connectViewer(this.view.selectedVmId, this.view.selectedViewer).subscribe({
      next: (windowView) => {
        this.view.window = windowView;
        this.view.statusMessage = windowView.statusMessage;
        this.view.errorMessage = '';
      },
      error: () => {
        this.view.errorMessage = 'Failed to connect viewer.';
      },
    });
  }

  toggleFullscreen(): void {
    if (this.view.selectedVmId == null) {
      return;
    }
    this.api.setFullscreen(this.view.selectedVmId, this.view.fullscreenEnabled).subscribe({
      next: (windowView) => {
        this.view.window = windowView;
        this.view.statusMessage = windowView.statusMessage;
        this.view.errorMessage = '';
      },
      error: () => {
        this.view.errorMessage = 'Failed to toggle fullscreen.';
      },
    });
  }

  sendKeys(): void {
    if (this.view.selectedVmId == null) {
      return;
    }
    this.api.sendKeys(this.view.selectedVmId, this.view.keyCombo).subscribe({
      next: (windowView) => {
        this.view.window = windowView;
        this.view.statusMessage = windowView.statusMessage;
        this.view.errorMessage = '';
      },
      error: () => {
        this.view.errorMessage = 'Failed to send key combo.';
      },
    });
  }

  private runAction(action: 'open' | 'status' | 'run' | 'pause'): void {
    if (this.view.selectedVmId == null) {
      return;
    }

    let request;
    switch (action) {
      case 'open':
        request = this.api.open(this.view.selectedVmId);
        break;
      case 'status':
        request = this.api.status(this.view.selectedVmId);
        break;
      case 'run':
        request = this.api.run(this.view.selectedVmId);
        break;
      case 'pause':
        request = this.api.pause(this.view.selectedVmId);
        break;
      default:
        return;
    }

    request.subscribe({
      next: (windowView) => {
        this.view.window = windowView;
        this.view.statusMessage = windowView.statusMessage;
        this.view.errorMessage = '';
      },
      error: () => {
        this.view.errorMessage = `Failed to ${action} console session.`;
      },
    });
  }
}
