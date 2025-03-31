import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {catchError, exhaustMap, filter, switchMap, take, throwError} from "rxjs";
import {inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {RequestMethodEnum} from "@core/shared/enum/request-method.enum";
import {Endpoint} from "@shared/domain/endpoint";
import {HttpStatusEnum} from "@core/shared/enum/http-status.enum";
import {is} from "@core/shared/checker";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IdentityState} from "@identity/identity/presentation/state/identity/identity.state";
import {IdentityActions} from "@identity/identity/presentation/state/identity/identity.actions";

/**
 * Set Authorization header to every request that has at config header.authorization = true
 *
 * @param request
 * @param next
 */
export const AccessTokenInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
// Get path from headers, path was set at prepareLocalHeaders
	const path = request.context.get(TokensHttpContext.PATH)

	if (path) {
		const {header} = Endpoint.endpointMap[request.method as RequestMethodEnum].get(path) ?? {};

		if (header?.authorization) {

			const store = inject(Store);

			return setAuthorizationToken(request, next, store).pipe(
				catchError((response) => {
					if (response instanceof  HttpErrorResponse && response.status === HttpStatusEnum.Unauthorized) {
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

					return throwError(() => response);
				})
			);

		}
	}

	return next(request);

}

function setAuthorizationToken(request: HttpRequest<unknown>, next: HttpHandlerFn, store: Store) {
	return store.select(IdentityState.token)
		.pipe(
			filter((token) => is.not_undefined(token)),
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

