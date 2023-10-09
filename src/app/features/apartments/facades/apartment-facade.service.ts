import { Injectable } from '@angular/core';

// models
import { Apartment, CityTypes, CityTypesFilter, Statistics } from '../models';

// config
import { All_Cities, Cities } from '../config';

// services
import { ApartmentsStore } from '../store';
import { ApartmentsService } from '../services';
import { StatisticsService } from '../services/statistics.service';
import { GlobalLoadingIndicatorService } from '../../../core/services';
import { ApartmentHelperService } from '../helpers/apartment-helper.service';

// rxjs
import { finalize, Observable, of, retry, shareReplay, Subject, switchMap, throwError, withLatestFrom } from 'rxjs';
import { catchError, combineLatestWith, distinctUntilChanged, map, startWith, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApartmentFacadeService {
  private onScrollSubject$ = new Subject<number>();

  constructor(
    private loadingIndicatorService: GlobalLoadingIndicatorService,
    private apartmentsService: ApartmentsService,
    private statisticsService: StatisticsService,
    private apartmentHelper: ApartmentHelperService,
    private store: ApartmentsStore
  ) {}

  set apartments(apartments: Apartment[]) {
    this.store.set('apartments', apartments);
  }

  get apartments$(): Observable<Apartment[]> {
    return this.store.select<Apartment[]>('apartments');
  }

  set pageNumber(page: number) {
    this.store.set('pageNumber', page);
  }

  get pageNumber$(): Observable<number> {
    return this.store.select<number>('pageNumber');
  }

  set allDataLoaded(allDataLoaded: boolean) {
    this.store.set<boolean>('allDataLoaded', allDataLoaded);
  }

  get allDataLoaded$(): Observable<boolean> {
    return this.store.select<boolean>('allDataLoaded');
  }

  set favourites(favourites: Apartment[]) {
    this.store.set('favourites', favourites);
  }

  get favourites$(): Observable<Apartment[]> {
    return this.store.select<Apartment[]>('favourites');
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
    return of(Object.values(Cities));
  }

  get favouritesIds$(): Observable<string[]> {
    return this.favourites$.pipe(
      map((favourites: Apartment[]) => {
        return favourites.map((apartment: Apartment) => apartment.id as string);
      })
    );
  }

  get onScrollEvent$() {
    return this.onScrollSubject$.pipe(
      withLatestFrom(this.selectedCity$),
      distinctUntilChanged(),
      switchMap(([pageNumber, selectedCity]) => this.getApartments(selectedCity, pageNumber))
    );
  }

  // reducers

  updateSelectedBorough(selectedBorough: string | typeof All_Cities) {
    this.selectedBorough = selectedBorough;
  }

  updateSelectedCity(selectedCity: CityTypesFilter) {
    this.selectedCity = selectedCity;
  }

  onCitySelected(city: CityTypesFilter) {
    this.store.patch({
      pageNumber: 1,
      allDataLoaded: false,
      selectedBorough: All_Cities,
      selectedCity: city,
    });

    return this.getApartments(city);
  }

  addToFavourites(apartment: Apartment) {
    this.favourites$.pipe(take(1)).subscribe((favourites: Apartment[]) => {
      this.favourites = [...favourites, apartment];
    });
  }

  removeFromFavourites(apartment: Apartment) {
    this.favourites$.pipe(take(1)).subscribe((favourites: Apartment[]) => {
      this.favourites = favourites.filter((favourite: Apartment) => favourite.id !== apartment.id);
    });
  }

  loadMore() {
    const nextPage = this.store.value.pageNumber + 1;
    this.onScrollSubject$.next(nextPage);
  }

  // side effects

  getApartments(city: CityTypesFilter = All_Cities, nextPage = 1): Observable<Apartment[]> {
    this.loaded = false;
    this.loading = true;
    this.loadingIndicatorService.setLoading(true);
    return this.apartmentsService.getApartments(city, nextPage).pipe(
      take(1),
      map((apartments: Apartment[]) => apartments.filter((apartment: Apartment) => apartment.availableFromNowOn)),
      tap((LoadedApartments: Apartment[]) => {
        const apartments = nextPage === 1 ? LoadedApartments : [...this.store.value.apartments, ...LoadedApartments];
        this.store.patch({
          apartments,
          loaded: true,
          pageNumber: nextPage,
          allDataLoaded: !LoadedApartments.length,
        });
      }),
      catchError((error) => throwError(error)),
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true,
      }),
      finalize(() => {
        this.loading = false;
        this.loadingIndicatorService.setLoading(false);
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
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true,
      }),
      finalize(() => this.loadingIndicatorService.setLoading(false))
    );
  }

  readonly statistics$: Observable<Statistics> = this.statisticsService.getStatistics().pipe(
    shareReplay(1),
    retry({
      count: 2,
      delay: 1000,
      resetOnSuccess: true,
    })
  );
}
