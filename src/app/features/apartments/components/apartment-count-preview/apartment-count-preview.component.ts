import { booleanAttribute, ChangeDetectionStrategy, Component, Input, numberAttribute } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

// models
import { CityTypesFilter } from '../../models';

// config
import { All_Cities } from '../../config';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-apartment-count-preview',
  templateUrl: './apartment-count-preview.component.html',
  styleUrls: ['./apartment-count-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentCountPreviewComponent {
  @Input({ required: true }) city: CityTypesFilter;
  @Input({ required: true, transform: numberAttribute }) apartmentCount: number;
  @Input({ required: true, transform: numberAttribute }) statisticByCity: number;
  @Input({ required: true, transform: booleanAttribute }) showLocation: boolean;

  get isCity() {
    return this.city !== All_Cities;
  }
}
