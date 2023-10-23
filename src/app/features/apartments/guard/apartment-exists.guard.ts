import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

// models
import { Apartment } from '../models';

// services
import { ApartmentFacadeService } from '../facades';

// rxjs
import { Observable, of } from 'rxjs';
import { switchMap, catchError, take } from 'rxjs/operators';
import { App_Route } from '../../../core/config';
import { NotFoundError } from '../../../core/helpers';

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
  readonly facade = inject(ApartmentFacadeService);

  checkStore(apartmentId: string) {
    return this.facade.loaded$.pipe(
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
    return this.facade.getApartment(apartmentId).pipe(
      switchMap(() => of(true)),
      catchError((error) => {
        if (error instanceof NotFoundError) {
          this.router.navigate([App_Route.apartment_List]).then();
        } else {
          this.router.navigateByUrl('/app-unavailable', { skipLocationChange: true }).then();
        }
        return of(false);
      })
    );
  }

  hasApartment(apartmentId: string): Observable<boolean> {
    return this.facade.apartments$.pipe(
      switchMap((apartments: Apartment[]) => {
        const apartmentExists = apartments.find((apartment) => apartment.id === apartmentId);
        if (apartmentExists) {
          this.facade.selectedApartment = apartmentExists;
          return of(true);
        }

        return this.getApartmentById(apartmentId);
      })
    );
  }
}
