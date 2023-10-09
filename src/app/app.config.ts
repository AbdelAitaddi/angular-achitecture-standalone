import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import {
  importProvidersFrom,
  ApplicationConfig,
  provideZoneChangeDetection,
  inject,
  APP_INITIALIZER,
  makeEnvironmentProviders,
  EnvironmentProviders,
  InjectionToken,
  LOCALE_ID,
  ErrorHandler,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  NavigationError,
  PreloadAllModules,
  provideRouter,
  Router,
  TitleStrategy,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withNavigationErrorHandler,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withJsonpSupport,
  withXsrfConfiguration,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// services
import { IconsService } from './core/services/icons.service';
import { GlobalErrorHandler, GlobalLoadingIndicatorService, TemplatePageTitleStrategy } from './core/services';

// routes
import { appRoutes } from './app.routes';

// models
import { AppConfig, StorageProvider } from './core/models';
import { setLanguage, TranslationModule } from './shared/functional/translation/translation.module';
import { MatDialogModule } from '@angular/material/dialog';

// Tokens
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
export const WINDOW = new InjectionToken<Window>('window');
export const BROWSER_LOCATION = new InjectionToken<Location>('window location');
export const STORAGE = new InjectionToken<StorageProvider>('storageObject');

export const config = (appConfig: AppConfig): ApplicationConfig => ({
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: false }),
    AppEnvironmentProviders(appConfig),
    importProvidersFrom([MatDialogModule, IconsService, GlobalLoadingIndicatorService, TranslationModule.forRoot()]),
    provideHttpClient(
      withInterceptors([]),
      withXsrfConfiguration({ cookieName: 'TOKEN', headerName: 'X-TOKEN' }),
      withJsonpSupport(),
      withFetch()
    ),
    provideRouter(
      appRoutes,
      // withDebugTracing(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling(),
      withPreloading(PreloadAllModules),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      withNavigationErrorHandler(() => inject(Router).navigate(['/**']))
    ),
  ],
});

export function AppEnvironmentProviders(appConfig: AppConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_CONFIG,
      useValue: appConfig,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (iconService: IconsService) => () => iconService.registerIcons(),
      deps: [IconsService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: setLanguage,
      deps: [TranslateService, APP_CONFIG, STORAGE],
      multi: true,
    },
    {
      provide: APP_BASE_HREF,
      useFactory: (platformLocation: PlatformLocation) => platformLocation.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
    {
      provide: LOCALE_ID,
      useFactory: (translate: TranslateService) => translate.currentLang,
      deps: [TranslateService],
    },
    {
      provide: BROWSER_LOCATION,
      useFactory: () => window.location,
    },
    {
      provide: STORAGE,
      useFactory: (): StorageProvider => ({ localStore: localStorage, sessionStore: sessionStorage }),
    },
    {
      provide: WINDOW,
      useFactory: () => window,
    },
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ]);
}
