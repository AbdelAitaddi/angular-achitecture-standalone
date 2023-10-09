import { App_Route, AppRouteTypes } from './app-route.models';
import { Icon_list, IconTypes } from '../services/icon.service';

export interface NavItem {
  route: AppRouteTypes;
  name: string;
  icon: IconTypes;
  hint: string;
}

export const nav_List: NavItem[] = [
  {
    route: App_Route.apartment_List,
    name: 'Apartments',
    icon: Icon_list.realEstate,
    hint: 'find your next flat',
  },
  {
    route: App_Route.favourites,
    name: 'My Favourites',
    icon: Icon_list.volunteerActivism,
    hint: 'view you favourites',
  },
  {
    route: App_Route.about,
    name: 'About',
    icon: Icon_list.info,
    hint: 'view app description',
  },
];
