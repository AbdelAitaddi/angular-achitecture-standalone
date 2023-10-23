import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatLineModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

// models
import { AppRouteTypes } from '../../models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [MatListModule, MatLineModule, MatIconModule, RouterModule, TranslateModule],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItemComponent {
  @Input() hint = '';
  @Input({ required: true }) name = '';
  @Input({ required: true }) icon = '';
  @Input({ required: true }) routerLink: AppRouteTypes = '/';
  @Output() toggle = new EventEmitter();
}
