import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

// models
import { Apartment } from '../models';
import { App_Route } from '../../../core/models';

// services
import { ApartmentFacadeService } from '../facades';

// rxjs
import { Observable, of } from 'rxjs';
import { switchMap, catchError, take, map } from 'rxjs/operators';

export const apartmentExistsGuards: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const apartmentExistsGuard = inject(ApartmentExistsGuardService);
  const { apartmentId } = route.params;

  return apartmentExistsGuard.checkStore(apartmentId).pipe(
    switchMap(() => of(true)),
    catchError(() => of(false))
  );
};

@Injectable({
  providedIn: 'root',
})
export class ApartmentExistsGuardService {
  readonly router = inject(Router);
  readonly facadeService = inject(ApartmentFacadeService);

  checkStore(apartmentId: string): Observable<boolean> {
    return this.facadeService.loaded$.pipe(
      take(1),
      switchMap((loaded) => {
        if (!loaded) {
          return this.getApartmentById(apartmentId);
        }

        return this.hasApartment(apartmentId);
      })
    );
  }

  getApartmentById(apartmentId: string): Observable<boolean> {
    return this.facadeService.getApartment(apartmentId).pipe(
      switchMap(() => of(true)),
      catchError(() => {
        this.router.navigate([App_Route.apartment_List]).then();
        return of(false);
      })
    );
  }

  hasApartment(apartmentId: string): Observable<boolean> {
    return this.facadeService.apartments$.pipe(
      map((apartments: Apartment[]) => {
        const apartmentExists = apartments.find((apartment) => apartment.id === apartmentId);
        if (apartmentExists) {
          this.facadeService.selectedApartment = apartmentExists;
          return true;
        }
        this.router.navigate([App_Route.apartment_List]).then();
        return false;
      })
    );
  }
}
