import {HttpContext, HttpContextToken, HttpInterceptorFn, HttpXsrfTokenExtractor} from "@angular/common/http";
import {inject} from "@angular/core";
import {catchError, throwError} from "rxjs";
import {NotificationService} from "./services/notification.service";

export const SILENT_ERROR_HANDLER = new HttpContextToken<boolean>(() => false);

export const SILENT_ERROR_CONTEXT = new HttpContext().set(SILENT_ERROR_HANDLER, true);

export const credentialInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenExtractor = inject(HttpXsrfTokenExtractor);
  const token = tokenExtractor.getToken();

  const isMutatingRequest = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);

  let headers = req.headers;
  if (token && isMutatingRequest) {
    headers = headers.set('X-XSRF-TOKEN', token);
  }

  const modified = req.clone({
    withCredentials: true,
    headers: headers
  });

  return next(modified);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notification = inject(NotificationService);

    const silentErrorHandling = req.context.get(SILENT_ERROR_HANDLER);

    return next(req).pipe(
        catchError(err => {
            if(!silentErrorHandling) {
                notification.handleError(err);
            }

            return throwError(() => err);
        })
    )
};