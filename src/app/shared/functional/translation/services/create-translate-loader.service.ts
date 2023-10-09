import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// models
import { AppConfig } from '../../../../core/models';

// rxjs
import { catchError, map } from 'rxjs/operators';

export function createTranslateLoader(http: HttpClient, appConfig: AppConfig) {
  return new NamespacedTranslationLoader(http, appConfig);
}

class NamespacedTranslationLoader implements TranslateLoader {
  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  getTranslation(lang: string) {
    const translateLoader = new TranslateHttpLoader(this.http, this.appConfig.translationsApiRoot, '');

    return translateLoader.getTranslation(lang).pipe(
      catchError((error) => {
        console.error('error by loading translation', error);
        const fallBackTranslateLoader = new TranslateHttpLoader(this.http, `/assets/i18n/`, '.json');

        return fallBackTranslateLoader.getTranslation(lang);
      }),
      map((translations) => this.prepareKeys(translations))
    );
  }

  prepareKeys(translations) {
    return Object.keys(translations).reduce(
      (acc, key) => ({
        ...acc,
        ['i18n.' + key]: translations[key],
      }),
      {}
    );
  }
}
