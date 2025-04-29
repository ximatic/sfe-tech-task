import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { AuthFacadeService } from './core/facades/auth-facade.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';

import { routes } from './app.routes';

function initializeApplication(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const facade: AuthFacadeService = inject(AuthFacadeService);

    facade.verify().subscribe(() => {
      resolve(true);
    });
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideAppInitializer(initializeApplication),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
