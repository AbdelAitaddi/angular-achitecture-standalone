import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// pipes
import { BoroughsPipe } from '../../pipes';

// components
import { ApartmentPreviewComponent } from '../apartment-preview/apartment-preview.component';
import { ApartmentCountPreviewComponent } from '../apartment-count-preview/apartment-count-preview.component';

// models
import { Apartment, CityTypesFilter, Statistics } from '../../models';

// config
import { All_Cities } from '../../config';

@Component({
  selector: 'app-apartment-preview-list',
  standalone: true,
  imports: [CommonModule, BoroughsPipe, ApartmentPreviewComponent, ApartmentCountPreviewComponent, TranslateModule],
  templateUrl: './apartment-preview-list.component.html',
  styleUrls: ['./apartment-preview-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentPreviewListComponent {
  @Input({ required: true }) favouritesIds: string[];
  @Input({ required: true }) apartments: Apartment[] = [];
  @Input({ transform: booleanAttribute }) showLocation: boolean;
  @Input({ transform: booleanAttribute }) allDataLoaded: boolean;
  @Input() statistics: Statistics;
  @Input() city: CityTypesFilter = All_Cities;

  isFavourite(apartment: Apartment): boolean {
    return this.favouritesIds.includes(apartment.id!);
  }

  get statisticsByCity(): number {
    return this.statistics ? this.statistics[this.city] : 0;
  }
}
