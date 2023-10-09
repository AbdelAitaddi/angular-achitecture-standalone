import { bootstrapApplication } from '@angular/platform-browser';
import AppComponent from './app/core/containers/app/app.component';

//App  config
import { config } from './app/app.config';

bootstrapApplication(AppComponent, config).catch((err) => console.error(err));
