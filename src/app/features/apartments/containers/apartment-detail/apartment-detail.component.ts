import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
  readonly facade = inject(ApartmentFacadeService);
  readonly location = inject(Location);

  viewModel$: Observable<ViewModel>;

  ngOnInit() {
    this.viewModel$ = combineLatest([this.facade.selectedApartment$, this.facade.favourites$]).pipe(
      map(([apartment, favourites]) => ({
        apartment,
        selected: favourites.includes(apartment!.id!),
      }))
    );
  }

  onSave(apartmentId: string) {
    this.facade.addToFavourites(apartmentId);
  }

  onRemove(apartmentId: string) {
    this.facade.removeFromFavourites(apartmentId);
  }

  onBack() {
    this.location.back();
  }
}
