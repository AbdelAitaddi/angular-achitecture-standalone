import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// models
import { All_Cities, Apartment, CityTypesFilter } from '../../models';

// services
import { ApartmentFacadeService } from '../../facades';

// components
import * as fromComponents from './../../components';

// rxjs
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ViewModel {
  favouritesApartments: Apartment[];
  favourites: string[];
  selectedCity: CityTypesFilter;
  selectedBorough: string | typeof All_Cities;
  loading: boolean;
  loaded: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, fromComponents.ApartmentPreviewListComponent],
  templateUrl: './apartment-favourites.component.html',
  styleUrls: ['./apartment-favourites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentFavouritesComponent implements OnInit {
  readonly facade = inject(ApartmentFacadeService);
  viewModel$: Observable<ViewModel>;

  ngOnInit() {
    this.viewModel$ = combineLatest([
      this.facade.favouritesApartments$,
      this.facade.favourites$,
      this.facade.loading$,
      this.facade.loaded$,
      this.facade.selectedCity$,
      this.facade.selectedBorough$,
    ]).pipe(
      map(([favouritesApartments, favourites, loading, loaded, selectedCity, selectedBorough]) => ({
        favouritesApartments,
        favourites,
        loading,
        loaded,
        selectedCity,
        selectedBorough,
      }))
    );
  }
}
