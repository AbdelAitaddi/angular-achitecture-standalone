import { inject, Injectable } from '@angular/core';
import { uniq } from 'lodash';

// models
import { All_Cities, Apartment, CityTypes, CityTypesFilter } from '../models';

// services
import { ApartmentsStore } from '../store';
import { ApartmentsService } from '../services';
import { GlobalLoadingIndicatorService } from '../../../core/services';
import { ApartmentHelperService } from '../helpers/apartment-helper.service';

// rxjs
import { finalize, Observable, retry, throwError } from 'rxjs';
import { catchError, combineLatestWith, map, startWith, take, tap, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApartmentFacadeService {
  readonly loadingIndicatorService = inject(GlobalLoadingIndicatorService);
  readonly apartmentsService = inject(ApartmentsService);
  readonly apartmentHelper = inject(ApartmentHelperService);
  readonly store = inject(ApartmentsStore);

  set apartments(apartments: Apartment[]) {
    this.store.set('apartments', apartments);
  }

  get apartments$(): Observable<Apartment[]> {
    return this.store.select<Apartment[]>('apartments');
  }

  set favourites(favourites: string[]) {
    this.store.set('favourites', favourites);
  }

  get favourites$(): Observable<string[]> {
    return this.store.select<string[]>('favourites');
  }

  set selectedCity(city: CityTypesFilter) {
    this.store.set('selectedCity', city);
  }

  get selectedCity$(): Observable<CityTypesFilter> {
    return this.store.select<CityTypesFilter>('selectedCity');
  }

  set selectedBorough(selectedBorough: string | typeof All_Cities) {
    this.store.set('selectedBorough', selectedBorough);
  }

  get selectedBorough$(): Observable<CityTypesFilter> {
    return this.store.select<CityTypesFilter>('selectedBorough');
  }

  set selectedApartment(apartment: Apartment | null) {
    this.store.set('selectedApartment', apartment);
  }

  get selectedApartment$(): Observable<Apartment | null> {
    return this.store.select<Apartment | null>('selectedApartment');
  }

  set loading(loading: boolean) {
    this.store.set('loading', loading);
  }

  get loading$(): Observable<boolean> {
    return this.store.select<boolean>('loading');
  }

  set loaded(loaded: boolean) {
    this.store.set('loaded', loaded);
  }

  get loaded$(): Observable<boolean> {
    return this.store.select<boolean>('loaded');
  }

  /////////////////  Side effects //////////////

  get boroughs$(): Observable<string[]> {
    return this.selectedCity$.pipe(
      combineLatestWith(this.apartments$),
      map(([selectedCity, apartments]: [CityTypesFilter, Apartment[]]) =>
        this.apartmentHelper.getMappedBoroughs(apartments, selectedCity)
      ),
      startWith([])
    );
  }

  get cities$(): Observable<Array<CityTypes>> {
    return this.apartments$.pipe(
      map((apartments: Apartment[]) => uniq(apartments.map(({ address: { city } }: Apartment) => city)))
    );
  }

  get apartmentByCity$(): Observable<Apartment[]> {
    return this.selectedCity$.pipe(
      combineLatestWith(this.apartments$),
      map(([selectedCity, apartments]: [CityTypesFilter, Apartment[]]) =>
        selectedCity === All_Cities
          ? apartments
          : this.apartmentHelper.filterByCityName(apartments, selectedCity as CityTypes)
      ),
      startWith([])
    );
  }

  get favouritesApartments$(): Observable<Apartment[]> {
    return this.apartments$.pipe(
      withLatestFrom(this.favourites$),
      map(([apartments, favourites]: [Apartment[], string[]]) =>
        apartments.filter((apartment) => favourites.includes(apartment.id!))
      )
    );
  }

  updateSelectedBorough(selectedBorough: string | typeof All_Cities) {
    this.selectedBorough = selectedBorough;
  }

  updateSelectedCity(selectedCity: CityTypesFilter) {
    this.selectedCity = selectedCity;
  }

  getApartments(): Observable<Apartment[]> {
    this.loaded = false;
    this.loading = true;
    this.loadingIndicatorService.setLoading(true);
    return this.apartmentsService.getApartments().pipe(
      map((apartments: Apartment[]) => apartments.filter((apartment: Apartment) => apartment.availableFromNowOn)),
      tap((apartments: Apartment[]) => {
        this.apartments = apartments;
        this.loaded = true;
      }),
      catchError((error) => throwError(error)),
      finalize(() => {
        this.loading = false;
        this.loadingIndicatorService.setLoading(false);
      }),
      retry({
        count: 3,
        delay: 1000,
        resetOnSuccess: true,
      })
    );
  }

  getApartment(id: string): Observable<Apartment> {
    this.loadingIndicatorService.setLoading(true);
    return this.apartmentsService.getApartment(id).pipe(
      tap((apartment: Apartment) => {
        this.selectedApartment = apartment;
      }),
      catchError((error) => throwError(error)),
      finalize(() => this.loadingIndicatorService.setLoading(false)),
      retry({
        count: 3,
        delay: 1000,
        resetOnSuccess: true,
      })
    );
  }

  addToFavourites(apartmentId: string) {
    this.favourites$.pipe(take(1)).subscribe((favourites: string[]) => {
      this.favourites = [...favourites, apartmentId];
    });
  }

  removeFromFavourites(apartmentId: string) {
    this.favourites$.pipe(take(1)).subscribe((favourites: string[]) => {
      this.favourites = favourites.filter((favourite) => favourite !== apartmentId);
    });
  }
}
