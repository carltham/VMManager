import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { AsyncJobApiService } from './async-job-api.service';
import { AsyncJobView } from './async-job.models';

@Component({
  selector: 'app-async-job',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './async-job.component.html',
  styleUrl: './async-job.component.css',
})
export class AsyncJobComponent implements OnDestroy {
  private readonly api = inject(AsyncJobApiService);
  private jobSub: Subscription | null = null;

  view: AsyncJobView = {
    isRunning: false,
    progress: 0,
    statusMessage: '',
    errorMessage: '',
  };

  start(): void {
    if (this.view.isRunning) {
      return;
    }

    this.view.progress = 0;
    this.view.statusMessage = 'Job started.';
    this.view.errorMessage = '';
    this.view.isRunning = true;

    this.jobSub = this.api.start().subscribe({
      next: (progress) => {
        this.view.progress = progress;
        if (progress === 100) {
          this.view.isRunning = false;
          this.view.statusMessage = 'Job completed.';
        }
      },
      error: () => {
        this.view.isRunning = false;
        this.view.errorMessage = 'Job failed.';
      },
    });
  }

  cancel(): void {
    this.jobSub?.unsubscribe();
    this.jobSub = null;
    this.view.isRunning = false;
    this.view.statusMessage = 'Job canceled.';
  }

  ngOnDestroy(): void {
    this.jobSub?.unsubscribe();
  }
}
