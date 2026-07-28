import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { AboutApiService } from './about-api.service';
import { AboutView } from './about.models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit {
  private readonly api = inject(AboutApiService);

  view: AboutView = {
    name: '',
    module: '',
    version: '',
    statusMessage: '',
    errorMessage: '',
  };

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.api.load().subscribe({
      next: (data) => {
        this.view.name = data['name'] ?? '';
        this.view.module = data['module'] ?? '';
        this.view.version = data['version'] ?? '';
        this.view.statusMessage = 'About data loaded.';
      },
      error: () => {
        this.view.errorMessage = 'Failed to load about data.';
      },
    });
  }
}
