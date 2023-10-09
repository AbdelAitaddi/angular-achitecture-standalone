import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Inject, Injectable } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';

// config
import { Breakpoints } from '../config';
import { BROWSER_LOCATION, STORAGE } from '../../app.config';
import { Language_Selection_Collection } from '../../shared/functional/translation/config';

// components

import { ModalComponent } from '../../shared/core/components';

// services
import { GlobalLoadingIndicatorService } from '../services';

// models
import { StorageProvider } from '../models';
import { LanguageSelection } from '../../shared/functional/translation/models';

// rxjs
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { AboutComponent } from '../containers/about/about.component';

@Injectable({
  providedIn: 'root',
})
export class AppFacadeService {
  private currentLangStore = new BehaviorSubject<string>(this.translate.currentLang);

  get currentLanguage$(): Observable<LanguageSelection> {
    return this.currentLangStore.asObservable().pipe(
      distinctUntilChanged(),
      map(
        (currentLanguage: string) =>
          Language_Selection_Collection.find(
            (item: LanguageSelection) => item.code === currentLanguage
          ) as LanguageSelection
      )
    );
  }

  get loading$(): Observable<boolean> {
    return this.loadingIndicatorService.loading$;
  }

  get isOpened$(): Observable<boolean> {
    return this.breakpointObserver.observe([Breakpoints.smallScreen]).pipe(map((result) => result.matches));
  }

  get sidenavMode$(): Observable<MatDrawerMode> {
    return this.breakpointObserver
      .observe([Breakpoints.largeScreen])
      .pipe(map((result) => (result.matches ? 'over' : 'side') as MatDrawerMode));
  }

  get onLangChange$(): Observable<string> {
    return this.translate.onLangChange.pipe(
      map((event) => event.lang),
      startWith(this.translate.currentLang)
    );
  }

  selectLanguage(selectedLang: LanguageSelection) {
    this.storage.localStore.setItem('preferredLanguage', selectedLang.code);
    this.location.reload();
  }

  private showDialog() {
    const dialogConfig: MatDialogConfig<{ component: typeof AboutComponent }> = {
      id: 'about-page',
      autoFocus: false,
      disableClose: true,
      data: { component: AboutComponent },
    };
    this.dialog.open(ModalComponent, dialogConfig);
  }

  constructor(
    @Inject(BROWSER_LOCATION) private location: Location,
    @Inject(STORAGE) private storage: StorageProvider,
    private loadingIndicatorService: GlobalLoadingIndicatorService,
    private breakpointObserver: BreakpointObserver,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {
    this.showDialog();
  }
}
