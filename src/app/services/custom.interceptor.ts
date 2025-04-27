import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environmets/environment';

export const customInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.url.includes('standings')){
    return next(req);
  }

  const auth = btoa(`${environment.user}:${environment.password}`);

  const cloneRequest = req.clone({
    setHeaders: {
      'Authorization': `Basic ${auth}`
    }
  });

  return next(cloneRequest);
};
