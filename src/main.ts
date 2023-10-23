import { bootstrapApplication } from '@angular/platform-browser';

// entry component
import AppComponent from './app/core/containers/app/app.component';

// app  config
import { config } from './app/app.config';

// models
import { AppConfig } from './app/core/models';

const requestInit: RequestInit = {
  cache: 'no-cache',
};

fetch('/assets/app-config/config.json', requestInit)
  .then((res) => res.json())
  .then((appConfig: AppConfig) => {
    console.info('Application running with config:', appConfig);

    bootstrapApplication(AppComponent, config(appConfig)).catch((err) => console.error(err));
  });
