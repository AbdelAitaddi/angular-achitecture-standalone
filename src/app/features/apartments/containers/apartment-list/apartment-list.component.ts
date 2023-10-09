import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// services
import { ApartmentFacadeService } from '../../facades';
import { BoroughsPipe } from '../../../../shared/pipes';

// models
import { All_Cities, Apartment, CityTypes, CityTypesFilter } from '../../models';
import { App_Route } from '../../../../core/models';

// components
import * as fromComponents from './../../components';

// rxjs
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

export interface ViewModel {
  favourites: string[];
  selectedCity: CityTypesFilter;
  selectedBorough: string | typeof All_Cities;
  loading: boolean;
  loaded: boolean;
  boroughs: string[];
  cities: CityTypes[];
  apartmentByCity: Apartment[];
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    BoroughsPipe,
    fromComponents.ApartmentPreviewListComponent,
    fromComponents.ApartmentFilterComponent,
  ],
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly location = inject(Location);
  readonly route = inject(ActivatedRoute);
  readonly facade = inject(ApartmentFacadeService);

  viewModel$: Observable<ViewModel>;

  ngOnInit() {
    this.viewModel$ = combineLatest([
      this.facade.favourites$,
      this.facade.selectedCity$,
      this.facade.selectedBorough$,
      this.facade.loading$,
      this.facade.loaded$,
      this.facade.boroughs$,
      this.facade.cities$,
      this.facade.apartmentByCity$,
    ]).pipe(
      map(([favourites, selectedCity, selectedBorough, loading, loaded, boroughs, cities, apartmentByCity]) => ({
        favourites,
        selectedCity,
        selectedBorough,
        loading,
        loaded,
        boroughs,
        cities,
        apartmentByCity,
      }))
    );

    this.route.params
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((params: Params) => params['cityId'] || All_Cities)
      )
      .subscribe((selectedCity) => {
        this.facade.updateSelectedCity(selectedCity);
      });
  }

  onBoroughSelected(boroughs: string | typeof All_Cities) {
    this.facade.updateSelectedBorough(boroughs);
  }

  onCitySelected(selectedCity: CityTypesFilter) {
    const path = selectedCity ? `/${selectedCity.toLowerCase()}` : '';
    this.location.go(`${App_Route.apartment_List}${path}`);

    this.facade.updateSelectedCity(selectedCity);
    this.facade.updateSelectedBorough(All_Cities);
  }
}
