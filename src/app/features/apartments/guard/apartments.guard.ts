import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// models
import { Apartment } from '../models';

// services
import { ApartmentFacadeService } from '../facades';

// rxjs
import { of, Observable, EMPTY } from 'rxjs';
import { switchMap, catchError, take, tap, filter } from 'rxjs/operators';

export const apartmentsGuard: CanActivateFn = () => {
  const guard = inject(ApartmentsGuardService);

  return guard.checkStore().pipe(
    switchMap(() => of(true)),
    catchError(() => of(false))
  );
};

@Injectable({
  providedIn: 'root',
})
export class ApartmentsGuardService {
  readonly facadeService = inject(ApartmentFacadeService);
  readonly router = inject(Router);

  checkStore() {
    return this.facadeService.loaded$.pipe(
      tap((loaded: boolean) => {
        if (!loaded) {
          this.loadApartments().subscribe();
        }
      }),
      filter(Boolean),
      take(1)
    );
  }

  loadApartments(): Observable<Apartment[]> {
    return this.facadeService.getApartments().pipe(
      catchError(() => {
        this.router.navigate(['/about']).then();
        return EMPTY;
      })
    );
  }
}
