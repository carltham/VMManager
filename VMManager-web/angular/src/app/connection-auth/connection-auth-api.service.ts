import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { ConnectionAuthResult } from './connection-auth.models';

@Injectable({ providedIn: 'root' })
export class ConnectionAuthApiService {
  authenticate(username: string, password: string, remember: boolean): Observable<ConnectionAuthResult> {
    if (!username.trim() || !password.trim()) {
      return of({ success: false, message: 'Username and password are required.' }).pipe(delay(200));
    }

    const mode = remember ? 'with stored session' : 'for current session';
    return of({ success: true, message: `Authenticated ${mode}.` }).pipe(delay(350));
  }
}
