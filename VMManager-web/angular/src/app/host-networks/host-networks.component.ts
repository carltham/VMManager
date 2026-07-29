import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HostNetworksApiService } from './host-networks-api.service';
import { HostNetworkItem } from './host-networks.models';

@Component({
  selector: 'app-host-networks',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './host-networks.component.html',
  styleUrl: './host-networks.component.css',
})
export class HostNetworksComponent implements OnInit {
  private readonly api = inject(HostNetworksApiService);

  networks: HostNetworkItem[] = [];
  selected: HostNetworkItem | null = null;

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.api.refresh().subscribe((items) => {
      this.networks = items;
      if (this.selected) {
        this.selected = items.find((item) => item.id === this.selected?.id) ?? items[0] ?? null;
      } else {
        this.selected = items[0] ?? null;
      }
    });
  }

  action(id: number, action: 'start' | 'stop' | 'delete'): void {
    if (action === 'delete') {
      this.api.delete(id).subscribe(() => this.refresh());
      return;
    }

    const request = action === 'start' ? this.api.start(id) : this.api.stop(id);
    request.subscribe(() => this.refresh());
  }

  apply(): void {
    if (!this.selected) {
      return;
    }
    this.api
      .apply(this.selected.id, this.selected.name, this.selected.autostart)
      .subscribe(() => this.refresh());
  }
}
