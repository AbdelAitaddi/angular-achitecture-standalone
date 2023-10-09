import {
  importProvidersFrom,
  ApplicationConfig,
  provideZoneChangeDetection,
  inject,
  APP_INITIALIZER,
  makeEnvironmentProviders,
  EnvironmentProviders,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  Router,
  TitleStrategy,
  withNavigationErrorHandler,
  withPreloading,
} from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withJsonpSupport,
  withXsrfConfiguration,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TemplatePageTitleStrategy } from './features/apartments/services/template-page-title-strategy.service';

// services
import { IconService } from './core/services/icon.service';
import { GlobalLoadingIndicatorService } from './core/services';

// interceptors
import { loggerInterceptor } from './core/interceptors/logger.interceptor';

// routes
import { appRoutes } from './app.routes';

export const config: ApplicationConfig = {
  providers: [
    provideAnimations(),
    providerRegisteredIcons(),
    providerTemplatePageTitleStrategy(),
    provideZoneChangeDetection({ eventCoalescing: false }),
    importProvidersFrom([IconService, GlobalLoadingIndicatorService]),
    provideHttpClient(
      withInterceptors([loggerInterceptor]),
      withXsrfConfiguration({ cookieName: 'TOKEN', headerName: 'X-TOKEN' }),
      withJsonpSupport(),
      withFetch()
    ),
    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules),
      withNavigationErrorHandler(() => inject(Router).navigate(['/about']).then())
    ),
  ],
};

export function providerRegisteredIcons(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      useFactory: (iconService: IconService) => () => iconService.registerIcons(),
      deps: [IconService],
      multi: true,
    },
  ]);
}

export function providerTemplatePageTitleStrategy(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy,
    },
  ]);
}
