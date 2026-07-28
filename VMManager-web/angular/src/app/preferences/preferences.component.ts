import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { PreferencesApiService } from './preferences-api.service';
import { PreferencesView } from './preferences.models';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css',
})
export class PreferencesComponent implements OnInit {
  private readonly api = inject(PreferencesApiService);

  view: PreferencesView = {
    theme: '',
    defaultConnectionUri: '',
    autoConnect: '',
    statusMessage: '',
    errorMessage: '',
  };

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.api.load().subscribe({
      next: (data) => {
        this.view.theme = data['theme'] ?? '';
        this.view.defaultConnectionUri = data['defaultConnectionUri'] ?? '';
        this.view.autoConnect = data['autoConnect'] ?? '';
        this.view.statusMessage = 'Preferences loaded.';
      },
      error: () => {
        this.view.errorMessage = 'Failed to load preferences.';
      },
    });
  }
}
