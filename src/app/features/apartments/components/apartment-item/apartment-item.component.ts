import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

// models
import { Apartment } from '../../models';
import { Icons } from '../../../../core/config';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-apartment-item',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './apartment-item.component.html',
  styleUrls: ['./apartment-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentItemComponent {
  @Input() apartment: Apartment;
  @Input() selected: boolean = false;
  @Output() save = new EventEmitter<Apartment>();
  @Output() remove = new EventEmitter<Apartment>();
  @Output() back = new EventEmitter<void>();

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

  get rentDetailInfo() {
    const {
      details: {
        rent: { baseRent, operationalCosts },
      },
    } = this.apartment;
    return `baseRent: ${baseRent} +  operational Costs: ${operationalCosts}`;
  }

  toggleFavourite(apartment: Apartment) {
    if (this.selected) {
      this.remove.emit(apartment);
    } else {
      this.save.emit(apartment);
    }
  }
}
