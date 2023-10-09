import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
