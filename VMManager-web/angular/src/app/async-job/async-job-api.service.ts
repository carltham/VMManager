import { Injectable } from '@angular/core';
import { Observable, interval, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AsyncJobApiService {
  start(): Observable<number> {
    return interval(250).pipe(
      take(21),
      map((tick) => tick * 5),
    );
  }
}
