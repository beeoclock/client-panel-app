import {HttpErrorResponse, HttpInterceptorFn} from "@angular/common/http";
import {catchError, throwError} from 'rxjs';

/**
 * TODO Handle any error on response
 * TODO Implement code which will serve any error in the system, perhaps some communicate of error will prepare in translate file, i.e. impero360.
 *
 * @param request
 * @param next
 */
export const ErrorInterceptor: HttpInterceptorFn = (request, next) => {

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('error', error);
      return throwError(error);
    })
  );

}
