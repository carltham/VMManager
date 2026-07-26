import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-base';
import { CreateVmWizardView } from './create-vm.models';

@Injectable({ providedIn: 'root' })
export class CreateVmApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/create-vm`;

  open(): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/open`, {});
  }

  close(wizardId: number): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/close`, {});
  }

  back(wizardId: number): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/back`, {});
  }

  next(wizardId: number): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/next`, {});
  }

  finish(wizardId: number): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/finish`, {});
  }

  changeConnection(wizardId: number, value: number): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/change-connection`, {
      value,
    });
  }

  changeInstallMethod(wizardId: number, value: string): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/change-install-method`, {
      value,
    });
  }

  browseIso(wizardId: number, value: string): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/browse-iso`, { value });
  }

  browseUrl(wizardId: number, value: string): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/browse-url`, { value });
  }

  browseImportSource(wizardId: number, value: string): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/browse-import-source`, {
      value,
    });
  }

  browseAppSource(wizardId: number, value: string): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/browse-app-source`, {
      value,
    });
  }

  browseOsContainerSource(wizardId: number, value: string): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(
      `${this.baseUrl}/${wizardId}/browse-os-container-source`,
      { value },
    );
  }

  toggleDetectOs(wizardId: number, value: boolean): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/toggle-detect-os`, {
      value,
    });
  }

  toggleStorage(wizardId: number, value: boolean): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/toggle-storage`, {
      value,
    });
  }

  changeArch(wizardId: number, value: string): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/change-arch`, { value });
  }

  changeType(wizardId: number, value: string): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/change-type`, { value });
  }

  changeMachine(wizardId: number, value: string): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/change-machine`, {
      value,
    });
  }

  editVmName(wizardId: number, value: string): Observable<CreateVmWizardView> {
    return this.http.post<CreateVmWizardView>(`${this.baseUrl}/${wizardId}/edit-vm-name`, {
      value,
    });
  }
}
