import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// services
import { ApartmentFacadeService } from '../../facades';

// components
import * as fromComponents from './../../components';

// models
import { Apartment, CityTypesFilter } from '../../models';

// config
import { All_Cities } from '../../config';

// rxjs
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

interface ViewModel {
  favouritesApartments: Apartment[];
  favouritesIds: string[];
  selectedCity: CityTypesFilter;
  selectedBorough: string | typeof All_Cities;
  loading: boolean;
  loaded: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, fromComponents.ApartmentPreviewListComponent, TranslateModule],
  templateUrl: './apartment-favourites.component.html',
  styleUrls: ['./apartment-favourites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentFavouritesComponent implements OnInit {
  viewModel$: Observable<ViewModel>;

  ngOnInit() {
    this.viewModel$ = combineLatest([
      this.facade.favourites$,
      this.facade.favouritesIds$,
      this.facade.loading$,
      this.facade.loaded$,
      this.facade.selectedCity$,
      this.facade.selectedBorough$,
    ]).pipe(
      map(([favouritesApartments, favouritesIds, loading, loaded, selectedCity, selectedBorough]) => ({
        favouritesApartments,
        favouritesIds,
        loading,
        loaded,
        selectedCity,
        selectedBorough,
      }))
    );
  }

  constructor(private facade: ApartmentFacadeService) {}
}
