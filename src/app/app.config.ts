import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch  } from '@angular/common/http';

import { ApplicationConfig, isDevMode, importProvidersFrom } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../../environment';
import { provideClientHydration } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    importProvidersFrom(ReactiveFormsModule)
  ]
};