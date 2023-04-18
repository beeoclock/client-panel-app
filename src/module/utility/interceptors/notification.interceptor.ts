import {HttpInterceptorFn} from "@angular/common/http";


/**
 * TODO Check which paths require to show some notification like toast or another type of notification, before and/or after the request is executed.
 * TODO Show the notifications in "flows", i.e.: show success notification after success request.
 *
 * @param request
 * @param next
 */
export const NotificationInterceptor: HttpInterceptorFn = (request, next) => {

  return next(request);

}
