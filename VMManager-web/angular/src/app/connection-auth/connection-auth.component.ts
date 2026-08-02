import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ConnectionAuthApiService } from './connection-auth-api.service';
import { ConnectionAuthView } from './connection-auth.models';

@Component({
  selector: 'app-connection-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './connection-auth.component.html',
  styleUrl: './connection-auth.component.css',
})
export class ConnectionAuthComponent {
  private readonly api = inject(ConnectionAuthApiService);

  view: ConnectionAuthView = {
    connectionId: 1,
    username: '',
    password: '',
    remember: false,
    statusMessage: '',
    errorMessage: '',
    isSubmitting: false,
  };

  authenticate(): void {
    this.view.statusMessage = '';
    this.view.errorMessage = '';

    if (!this.view.username.trim() || !this.view.password.trim()) {
      this.view.errorMessage = 'Username and password are required.';
      return;
    }

    this.view.isSubmitting = true;

    this.api
      .authenticate(this.view.connectionId, this.view.username, this.view.password, this.view.remember)
      .subscribe({
      next: (result) => {
        this.view.isSubmitting = false;
        if (result.success) {
          this.view.statusMessage = result.message;
          this.view.password = '';
        } else {
          this.view.errorMessage = result.message;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.view.isSubmitting = false;
        this.view.errorMessage =
          (error.error as { detail?: string; message?: string } | null)?.detail ||
          (error.error as { detail?: string; message?: string } | null)?.message ||
          'Authentication request failed.';
      },
    });
  }
}
