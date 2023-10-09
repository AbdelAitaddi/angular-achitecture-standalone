import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// models
import { Apartment } from '../../models';
import { App_Route } from '../../../../core/models';

// pipes
import { EllipsisPipe, HighlighterPipe } from '../../../../shared/pipes';
import { Icon_list } from '../../../../core/services/icon.service';

@Component({
  selector: 'app-apartment-preview',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, EllipsisPipe, HighlighterPipe],
  templateUrl: './apartment-preview.component.html',
  styleUrls: ['./apartment-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentPreviewComponent {
  @Input({ required: true }) apartment: Apartment;
  @Input({ required: true }) favourites: string[];

  apartmentDetailRoute = App_Route.apartment_detail;
  Icon_list = Icon_list;

  get apartmentAddress() {
    const {
      address: { streetName, houseNumber, postalCode, city },
    } = this.apartment;
    return `${streetName} ${houseNumber} ${postalCode} ${city}`;
  }

  get totalPrice() {
    const {
      details: {
        rent: { totalRent },
      },
      localization: { currency },
    } = this.apartment;
    return `${totalRent} ${currency}`;
  }

  get isFavourite(): boolean {
    return this.favourites.includes(this.apartment.id!);
  }
}
