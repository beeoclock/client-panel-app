import {HttpInterceptorFn} from "@angular/common/http";

/**
 * TODO Check which paths at endpoint configuration have loading property set to "true", and show global loader for those endpoints.
 *
 * @param request
 * @param next
 */
export const ClearLocalHeadersInterceptor: HttpInterceptorFn = (request, next) => {

  request = request.clone({
    headers: request.headers.delete('path'),
  });

  return next(request);

}
