import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatLineModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

// components
import { LanguageSelectionComponent, NavItemComponent } from '../../components';

// service
import { AppFacadeService } from '../../facades/app-facade.service';

// rxjs
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// models
import { NavItem } from '../../models';
import { LanguageSelection } from '../../../shared/functional/translation/models';

// config
import { Icons, nav_List } from '../../config';
import { Language_Selection_Collection } from '../../../shared/functional/translation/config';

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
    LanguageSelectionComponent,
    TranslateModule,
    MatDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AppComponent {
  private appFacade = inject(AppFacadeService) as AppFacadeService;
  private document = inject(DOCUMENT) as Document;

  loading$: Observable<boolean>;
  isOpened$: Observable<boolean>;
  sidenavMode$: Observable<MatDrawerMode>;
  currentLanguage$: Observable<LanguageSelection>;

  readonly icons = Icons;
  readonly navList: NavItem[] = nav_List;
  readonly languageCollection: LanguageSelection[] = Language_Selection_Collection;

  ngOnInit() {
    this.loading$ = this.appFacade.loading$;
    this.isOpened$ = this.appFacade.isOpened$;
    this.sidenavMode$ = this.appFacade.sidenavMode$;
    this.currentLanguage$ = this.appFacade.currentLanguage$;

    this.appFacade.onLangChange$.pipe(filter(() => !!this.document)).subscribe((language: string) => {
      this.document.documentElement.lang = language;
    });
  }

  selectLanguage(selectedLang: LanguageSelection) {
    this.appFacade.selectLanguage(selectedLang);
  }
}
