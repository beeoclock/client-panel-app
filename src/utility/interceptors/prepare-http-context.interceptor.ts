import {HttpInterceptorFn} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

/**
 * TODO Check which paths at endpoint configuration have loading property set to "true", and show global loader for those endpoints.
 *
 * @param request
 * @param next
 */
export const PrepareHttpContextInterceptor: HttpInterceptorFn = (request, next) => {

  request = request.clone({
		context: request.context.set(TokensHttpContext.PATH, request.url)
  });

  return next(request);

}
