import {HttpInterceptorFn} from "@angular/common/http";

/**
 * TODO Check which paths at endpoint configuration have loading property set to "true", and show global loader for those endpoints.
 *
 * @param request
 * @param next
 */
export const LoadingInterceptor: HttpInterceptorFn = (request, next) => {

  return next(request);

}
