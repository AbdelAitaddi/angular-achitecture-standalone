import { Routes } from '@angular/router';

// guards
import { apartmentExistsGuards, apartmentsGuard } from './guard';

const apartmentsRoutes: Routes = [
  {
    path: '',
    title: 'i18n.core.pageTitle.apartments',
    canActivate: [apartmentsGuard],
    loadComponent: () =>
      import('./containers/apartment-list/apartment-list.component').then((cmp) => cmp.ApartmentListComponent),
  },
  {
    path: 'detail/:apartmentId',
    title: 'i18n.core.pageTitle.apartmentDetail',
    canActivate: [apartmentExistsGuards],
    loadComponent: () =>
      import('./containers/apartment-detail/apartment-detail.component').then((cmp) => cmp.ApartmentDetailComponent),
  },
  {
    path: 'favourites',
    title: 'i18n.core.pageTitle.favourites',
    loadComponent: () =>
      import('./containers/apartment-favourites/apartment-favourites.component').then(
        (cmp) => cmp.ApartmentFavouritesComponent
      ),
  },
];

export default apartmentsRoutes;
