import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

// services
import { ApartmentFacadeService } from '../facades';

// models
import { CityTypesFilter, Statistics } from '../models';

// config
import { All_Cities } from '../config';

// rxjs
import { of, Observable, combineLatest } from 'rxjs';
import { switchMap, catchError, take } from 'rxjs/operators';

export const apartmentsGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const guard = inject(ApartmentsGuardService);
  const cityId = route.queryParams['city'] || All_Cities;

  return guard.checkStore(cityId);
};

@Injectable({
  providedIn: 'root',
})
export class ApartmentsGuardService {
  readonly facade = inject(ApartmentFacadeService);
  readonly router = inject(Router);

  checkStore(cityId: CityTypesFilter): Observable<boolean> {
    return combineLatest([
      this.facade.loaded$.pipe(take(1)),
      this.facade.selectedCity$.pipe(take(1)),
      this.facade.statistics$,
    ]).pipe(
      switchMap(([loaded, selectedCity]: [boolean, CityTypesFilter, Statistics]) =>
        loaded && selectedCity === cityId ? of(loaded) : this.loadApartments(cityId)
      ),
      catchError(() => {
        this.router.navigateByUrl('/app-unavailable', { skipLocationChange: true }).then();
        return of(false);
      })
    );
  }

  loadApartments(cityId: CityTypesFilter): Observable<boolean> {
    return this.facade.getApartments(cityId).pipe(switchMap(() => of(true)));
  }
}
