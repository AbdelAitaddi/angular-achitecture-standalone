import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, importProvidersFrom, inject } from '@angular/core';
import { provideHttpClient, withInterceptors, withRequestsMadeViaParent } from '@angular/common/http';

// services
import { ApartmentsStore } from './features/apartments/store';
import { ApartmentsService } from './features/apartments/services';
import { ApartmentFacadeService } from './features/apartments/facades';
import { ApartmentHelperService } from './features/apartments/helpers/apartment-helper.service';

// guards
import { ApartmentExistsGuardService, ApartmentsGuardService } from './features/apartments/guard';

//interceptors
import { loggerInterceptor } from './core/interceptors/logger.interceptor';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'apartments',
    pathMatch: 'full',
  },
  {
    path: 'apartments',
    providers: [
      {
        provide: ENVIRONMENT_INITIALIZER,
        multi: true,
        useValue: () => inject(ApartmentsStore).reset(),
      },
      provideHttpClient(withRequestsMadeViaParent(), withInterceptors([loggerInterceptor])),
      importProvidersFrom([
        ApartmentsStore,
        ApartmentsService,
        ApartmentFacadeService,
        ApartmentsGuardService,
        ApartmentExistsGuardService,
        ApartmentHelperService,
      ]),
    ],
    loadChildren: () => import('./features/apartments/apartments.routes'),
  },
  {
    path: 'about',
    title: 'i18n.core.pageTitle.about',
    loadComponent: () => import('./core/containers/about/about.component').then((cmp) => cmp.AboutComponent),
  },
  {
    path: 'app-unavailable',
    title: 'i18n.core.pageTitle.appUnavailable',
    loadComponent: () =>
      import('./core/containers/app-unavailable/app-unavailable.component').then((cmp) => cmp.AppUnavailableComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/containers/page-not-found/page-not-found.component').then((cmp) => cmp.PageNotFoundComponent),
  },
];
