import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';

// rxjs
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export const initial_State = new InjectionToken('initialState');

@Injectable()
export abstract class Store<T> implements OnDestroy {
  protected subject: BehaviorSubject<T>;
  protected store: Observable<T>;

  protected constructor(@Inject(initial_State) private initialState: T) {
    this.subject = new BehaviorSubject<T>(this.initialState);
    this.store = this.subject.asObservable().pipe(distinctUntilChanged());
  }

  get value(): T {
    return this.subject.value;
  }

  set<G>(name: keyof T, state: G) {
    this.subject.next({
      ...this.value,
      [name]: state,
    });
  }

  patch(state: Partial<T>) {
    this.subject.next({
      ...this.value,
      ...state,
    });
  }

  select<G>(name: keyof T): Observable<G> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.store.pipe(
      map((store: T) => store[name]),
      distinctUntilChanged()
    );
  }

  reset() {
    this.patch(this.initialState);
  }

  ngOnDestroy() {
    this.subject.complete();
  }
}
