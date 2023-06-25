import {HttpInterceptorFn} from "@angular/common/http";

/**
 * TODO Check which paths at endpoint configuration have loading property set to "true", and show global loader for those endpoints.
 *
 * @param request
 * @param next
 */
export const PrepareLocalHeadersInterceptor: HttpInterceptorFn = (request, next) => {

  request = request.clone({
    headers: request.headers.set('path', request.url)
  });

  return next(request);

}
