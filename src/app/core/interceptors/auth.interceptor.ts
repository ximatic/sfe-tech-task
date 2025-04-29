import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthFacadeService } from '../facades/auth-facade.service';

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

  const token = inject(AuthFacadeService).token();

  if (token) {
    request = request.clone({
      headers: request.headers.append('Authorization', `Bearer ${token}`),
    });
  }

  return next(request);
};
