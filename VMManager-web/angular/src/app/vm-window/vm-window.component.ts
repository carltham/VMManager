import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { VmWindowTab, VmWindowView } from './vm-window.models';

@Component({
  selector: 'app-vm-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vm-window.component.html',
  styleUrl: './vm-window.component.css',
})
export class VmWindowComponent {
  @Input() vmWindow: VmWindowView | null = null;

  @Output() closeWindow = new EventEmitter<void>();
  @Output() switchTab = new EventEmitter<VmWindowTab>();
  @Output() action = new EventEmitter<'start' | 'pause' | 'reset' | 'reboot' | 'shutdown' | 'save' | 'status'>();
}
