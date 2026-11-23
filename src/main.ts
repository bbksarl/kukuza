import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import './design-system/app.css';
bootstrapApplication(AppComponent, appConfig).catch((error) =>
  console.error('[kukuza] bootstrap failed', error),
);
