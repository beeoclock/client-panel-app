import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse} from "@angular/common/http";
import {catchError, exhaustMap, filter, switchMap, take, throwError} from "rxjs";
import {inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {IdentityState} from "@identity/state/identity/identity.state";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {Endpoint} from "@utility/domain/endpoint";
import {IdentityActions} from "@identity/state/identity/identity.actions";

/**
 * Set Authorization header to every request that has at config header.authorization = true
 *
 * @param request
 * @param next
 */
export const AccessTokenInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {

	const {header} = Endpoint.endpointMap[request.method as RequestMethodEnum].get(request.url) ?? {};

	if (header?.authorization) {

		const store = inject(Store);

		return setAuthorizationToken(request, next, store).pipe(
			catchError((response: HttpResponse<unknown>) => {
				if (response instanceof HttpErrorResponse) {
					if (response.status === 401) {
						return store.select(IdentityState.refreshTokenInProgress)
							.pipe(
								take(1),
								switchMap((refreshTokenInProgress) => {
									if (refreshTokenInProgress) {
										return queue(next, request, store);
									}
									return store.dispatch(new IdentityActions.RefreshTokenExecute()).pipe(
										switchMap(() => setAuthorizationToken(request, next, store)),
									)
								})
							);
					}
				}

				return throwError(() => response);
			})
		);

	}

	return next(request);

}

function setAuthorizationToken(request: HttpRequest<unknown>, next: HttpHandlerFn, store: Store) {
	return store.select(IdentityState.token)
		.pipe(
			exhaustMap((tokenState) => {
				const headers = request.headers.set('Authorization', `Bearer ${tokenState?.token}`);
				return next(request.clone({
						headers
					})
				);
			})
		);
}


/**
 *
 * @param next
 * @param request
 * @param store
 * @private
 */
function queue(next: HttpHandlerFn, request: HttpRequest<unknown>, store: Store) {
	return store.select(IdentityState.refreshTokenInProgress).pipe(
		filter((refreshTokenInProgress) => !refreshTokenInProgress),
		take(1),
		switchMap(() => next(request)),
	);
}

