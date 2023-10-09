import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// models
import { Apartment } from '../../models';

// pipes
import { BoroughsPipe } from '../../../../shared/pipes';

// components
import * as fromComponents from './..';

@Component({
  selector: 'app-apartment-preview-list',
  standalone: true,
  imports: [CommonModule, BoroughsPipe, fromComponents.ApartmentPreviewComponent],
  templateUrl: './apartment-preview-list.component.html',
  styleUrls: ['./apartment-preview-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentPreviewListComponent {
  @Input({ required: true }) apartments: Apartment[];
  @Input({ required: true }) favourites: string[];
}
