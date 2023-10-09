import { Routes } from '@angular/router';

// guards
import { apartmentExistsGuards, apartmentsGuard } from './guard';

const apartmentsRoutes: Routes = [
  {
    path: 'list',
    title: 'Apartment list',
    canActivate: [apartmentsGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./containers/apartment-list/apartment-list.component').then((cmp) => cmp.ApartmentListComponent),
      },
      {
        path: ':cityId',
        loadComponent: () =>
          import('./containers/apartment-list/apartment-list.component').then((cmp) => cmp.ApartmentListComponent),
      },
    ],
  },
  {
    path: 'detail/:apartmentId',
    title: 'Apartment detail',
    canActivate: [apartmentExistsGuards],
    loadComponent: () =>
      import('./containers/apartment-detail/apartment-detail.component').then((cmp) => cmp.ApartmentDetailComponent),
  },
  {
    path: 'favourites',
    title: 'Favourites',
    canActivate: [apartmentsGuard],
    loadComponent: () =>
      import('./containers/apartment-favourites/apartment-favourites.component').then(
        (cmp) => cmp.ApartmentFavouritesComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./../../core/containers/page-not-found/page-not-found.component').then(
        (cmp) => cmp.PageNotFoundComponent
      ),
  },
];

export default apartmentsRoutes;
