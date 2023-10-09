import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

// services
import { ApartmentFacadeService } from '../../facades';

// models
import { Apartment } from '../../models';

// components
import * as fromComponents from './../../components';

// rxjs
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ViewModel {
  apartment: Apartment | null;
  selected: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, fromComponents.ApartmentItemComponent],
  templateUrl: './apartment-detail.component.html',
  styleUrls: ['./apartment-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentDetailComponent implements OnInit {
  viewModel$: Observable<ViewModel>;

  constructor(private facade: ApartmentFacadeService, private location: Location) {}

  ngOnInit() {
    this.viewModel$ = combineLatest([this.facade.selectedApartment$, this.facade.favouritesIds$]).pipe(
      map(([apartment, favouriteIds]) => ({
        apartment,
        selected: !!(apartment?.id && favouriteIds.includes(apartment.id)),
      }))
    );
  }

  onSave(apartment: Apartment) {
    this.facade.addToFavourites(apartment);
  }

  onRemove(apartment: Apartment) {
    this.facade.removeFromFavourites(apartment);
  }

  onBack() {
    this.location.back();
  }
}
