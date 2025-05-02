import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { AuthFacadeService } from '../facades/auth-facade.service';
import { UsersFacadeService } from '../facades/users-facade.service';
import { Router } from '@angular/router';

interface ExcludedUrl {
  url: string;
  method: string;
}

function isExcludedUrl(url: string, method: string): boolean {
  const excludedUrls: ExcludedUrl[] = [
    {
      url: '/auth',
      method: 'POST',
    },
  ];

  return (
    excludedUrls.filter((excludedUrl: ExcludedUrl) => {
      return url.includes(excludedUrl.url) && method === excludedUrl.method;
    }).length > 0
  );
}

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (isExcludedUrl(request.url, request.method)) {
    return next(request);
  }

  const router = inject(Router);
  const authFacade = inject(AuthFacadeService);
  const userFacade = inject(UsersFacadeService);
  const token = authFacade.token();

  if (token) {
    request = request.clone({
      headers: request.headers.append('Authorization', `Bearer ${token}`),
    });
  }

  return next(request).pipe(
    tap(
      () => {},
      (error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          authFacade.logout().subscribe(() => {
            userFacade.clear();
            router.navigate(['/auth']);
          });
        }
      }
    )
  );
};
