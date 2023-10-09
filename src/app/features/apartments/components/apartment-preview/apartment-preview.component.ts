import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// models
import { Apartment } from '../../models';

// pipes

import { App_Route, Icons } from '../../../../core/config';
import { EllipsisPipe, HighlighterPipe, NgxDatePipe } from '../../../../shared/core/pipes';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-apartment-preview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    EllipsisPipe,
    HighlighterPipe,
    NgxDatePipe,
    TranslateModule,
  ],
  templateUrl: './apartment-preview.component.html',
  styleUrls: ['./apartment-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentPreviewComponent {
  @Input() apartment: Apartment;
  @Input() isFavourite: boolean = false;

  apartmentDetailRoute = App_Route.apartment_detail;
  Icon_list = Icons;

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
}
