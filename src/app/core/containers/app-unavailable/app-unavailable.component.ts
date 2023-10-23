import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

// config
import { BROWSER_LOCATION } from '../../../app.config';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './app-unavailable.component.html',
  styleUrls: ['./app-unavailable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUnavailableComponent {
  readonly location = inject(BROWSER_LOCATION) as Location;

  reload() {
    this.location.reload();
  }
}
