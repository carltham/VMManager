import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { App } from './app';
import { ManagerApiService } from './manager-api.service';
import { VmWindowApiService } from './vm-window-api.service';

describe('App', () => {
  const managerApiStub: Partial<ManagerApiService> = {
    getOverview: () =>
      of({
        statsEnabled: true,
        connections: [],
      }),
  };

  const vmWindowApiStub: Partial<VmWindowApiService> = {
    open: () =>
      of({
        vm: { id: 1, connectionId: 1, name: 'dev-fedora', state: 'RUNNING', opened: true },
        activeTab: 'CONSOLE',
        statusMessage: 'VM window opened',
        consoleText: 'Console connected',
        detailsText: 'State=RUNNING',
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: ManagerApiService, useValue: managerApiStub },
        { provide: VmWindowApiService, useValue: vmWindowApiStub },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render manager heading', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('VM Manager');
  });
});
