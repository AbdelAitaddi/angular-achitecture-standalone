import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatLineModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

// service
import { GlobalLoadingIndicatorService } from '../../services';

// components
import { NavItemComponent } from '../../components';

// models
import { nav_List, NavItem } from '../../models';

// rxjs
import { Observable } from 'rxjs';
import { Icon_list, IconTypes } from '../../services/icon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatButtonModule,
    MatLineModule,
    MatSelectModule,
    MatTooltipModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatListModule,
    NavItemComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AppComponent implements OnInit {
  readonly loadingIndicatorService = inject(GlobalLoadingIndicatorService);
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;

  readonly navList: NavItem[] = nav_List;
  readonly locationCityIcon: IconTypes = Icon_list.locationCity;

  loading$: Observable<boolean>;
  opened = false;

  ngOnInit() {
    this.loading$ = this.loadingIndicatorService.loading$;
    this.opened = window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.opened = !((event?.target as Window).innerWidth < 768);
  }

  get isBiggerScreen(): 'over' | 'side' {
    return Boolean((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) < 992)
      ? 'over'
      : 'side';
  }
}
