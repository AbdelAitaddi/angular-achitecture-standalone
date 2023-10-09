import { Injectable } from '@angular/core';

// rxjs
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalLoadingIndicatorService {
  private loading = new BehaviorSubject(false);

  loading$ = this.loading.asObservable();

  setLoading(loading: boolean) {
    this.loading.next(loading);
  }
}
