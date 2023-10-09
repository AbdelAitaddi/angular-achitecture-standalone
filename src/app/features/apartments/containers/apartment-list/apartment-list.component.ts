import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// components
import * as fromComponents from './../../components';

// services
import { BoroughsPipe } from '../../pipes';
import { ApartmentFacadeService } from '../../facades';

// models
import { Apartment, CityTypes, CityTypesFilter, Statistics } from '../../models';

// config
import { All_Cities } from '../../config';

// rxjs
import { distinctUntilChanged, map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

export interface ViewModel {
  favouritesIds: string[];
  selectedCity: CityTypesFilter;
  selectedBorough: string | typeof All_Cities;
  loading: boolean;
  loaded: boolean;
  allDataLoaded: boolean;
  boroughs: string[];
  cities: CityTypes[];
  apartmentByCity: Apartment[];
  statistics: Statistics;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    BoroughsPipe,
    TranslateModule,
    fromComponents.ApartmentPreviewListComponent,
    fromComponents.ApartmentFilterComponent,
    InfiniteScrollModule,
  ],
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentListComponent implements OnInit {
  private readonly facade = inject(ApartmentFacadeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  viewModel$: Observable<ViewModel>;

  ngOnInit() {
    this.viewModel$ = combineLatest([
      this.facade.favouritesIds$,
      this.facade.selectedCity$,
      this.facade.selectedBorough$,
      this.facade.loading$,
      this.facade.loaded$,
      this.facade.allDataLoaded$,
      this.facade.boroughs$,
      this.facade.cities$,
      this.facade.apartments$,
      this.facade.statistics$,
    ]).pipe(
      map(
        ([
          favouritesIds,
          selectedCity,
          selectedBorough,
          loading,
          loaded,
          allDataLoaded,
          boroughs,
          cities,
          apartmentByCity,
          statistics,
        ]) => ({
          favouritesIds,
          selectedCity,
          selectedBorough,
          loading,
          loaded,
          allDataLoaded,
          boroughs,
          cities,
          apartmentByCity,
          statistics,
        })
      )
    );

    this.route.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        map((params: Params) => params['city'] || All_Cities)
      )
      .subscribe((selectedCity) => {
        this.facade.updateSelectedCity(selectedCity);
      });

    this.facade.onScrollEvent$.pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged()).subscribe();
  }

  onScrollDown() {
    this.facade.loadMore();
  }

  onBoroughSelected(boroughs: string | typeof All_Cities) {
    this.facade.updateSelectedBorough(boroughs);
  }

  onCitySelected(city: CityTypesFilter) {
    this.router.navigate([], { queryParams: { city } }).then(() => this.facade.onCitySelected(city).subscribe());
  }
}
