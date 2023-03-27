import {HttpInterceptorFn} from "@angular/common/http";

/**
 * TODO The interceptor needs to check which paths are required to be accepted by user to make the request.
 * TODO Check the property: requires.approval
 *
 * @param request
 * @param next
 */
export const ApprovalInterceptor: HttpInterceptorFn = (request, next) => {

  return next(request);

}
