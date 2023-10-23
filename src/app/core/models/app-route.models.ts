import { App_Route } from '../config/app-route.config';

export type AppRouteTypes = (typeof App_Route)[keyof typeof App_Route];
