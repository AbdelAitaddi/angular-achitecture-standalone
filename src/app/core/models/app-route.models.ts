export const App_Route = {
  root: '/',
  about: '/about',
  apartment_Module: '/apartment',
  apartment_List: '/apartment/list',
  apartment_detail: '/apartment/detail/',
  favourites: '/apartment/favourites',
} as const;

export type AppRouteTypes = (typeof App_Route)[keyof typeof App_Route];
