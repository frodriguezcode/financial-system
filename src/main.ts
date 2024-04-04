import { enableProdMode, importProvidersFrom,NgModule  } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import {  MessageService, SelectItem } from 'primeng/api';

import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';



if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    providers: [
      provideAnimations()
    ]
  })
  .catch((err) => console.error(err));


