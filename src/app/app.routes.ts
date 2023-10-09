import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

// services
import { ApartmentsService } from './features/apartments/services';
import { ApartmentFacadeService } from './features/apartments/facades';
import { ApartmentHelperService } from './features/apartments/helpers/apartment-helper.service';
import { ApartmentExistsGuardService, ApartmentsGuardService } from './features/apartments/guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'apartment/list',
    pathMatch: 'full',
  },
  {
    path: 'apartment',
    providers: [
      importProvidersFrom([
        ApartmentFacadeService,
        ApartmentsService,
        ApartmentsGuardService,
        ApartmentExistsGuardService,
        ApartmentHelperService,
      ]),
    ],
    loadChildren: () => import('./features/apartments/apartments.routes'),
  },
  {
    path: 'about',
    title: 'About application',
    loadComponent: () => import('./core/containers/about/about.component').then((cmp) => cmp.AboutComponent),
  },
];
