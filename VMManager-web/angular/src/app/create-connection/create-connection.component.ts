import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CreateConnectionApiService } from './create-connection-api.service';
import { CreateConnectionView } from './create-connection.models';

@Component({
  selector: 'app-create-connection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-connection.component.html',
  styleUrl: './create-connection.component.css',
})
export class CreateConnectionComponent implements OnInit {
  private readonly api = inject(CreateConnectionApiService);

  view: CreateConnectionView = {
    name: '',
    uri: 'qemu:///system',
    connections: [],
    statusMessage: '',
    errorMessage: '',
    submitting: false,
  };

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.api.listConnections().subscribe({
      next: (connections) => {
        this.view.connections = connections;
      },
      error: () => {
        this.view.errorMessage = 'Failed to load connections.';
      },
    });
  }

  submit(): void {
    this.view.errorMessage = '';
    this.view.statusMessage = '';
    this.view.submitting = true;

    this.api.createConnection(this.view.name, this.view.uri).subscribe({
      next: (connection) => {
        this.view.statusMessage = `Connection ${connection.name} created.`;
        this.view.name = '';
        this.view.submitting = false;
        this.refresh();
      },
      error: (err) => {
        this.view.errorMessage = err?.error?.message ?? 'Failed to create connection.';
        this.view.submitting = false;
      },
    });
  }
}
