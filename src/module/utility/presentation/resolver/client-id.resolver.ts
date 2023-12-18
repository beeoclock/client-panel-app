import {ResolveFn, Router} from "@angular/router";
import {IdentityState} from "@identity/state/identity/identity.state";
import {inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {EMPTY, exhaustMap, filter, of} from "rxjs";
import {is} from "thiis";

export const clientIdResolver: ResolveFn<string | undefined> = () => {

	const store = inject(Store);
	const router = inject(Router);

	console.log(router.url);

	return store.select(IdentityState.clientId).pipe(
		exhaustMap((clientId) => {
			console.log(clientId)
			if (clientId) {
				return of(clientId);
			}
			return store.select(IdentityState.token).pipe(
				filter((token) => is.not_undefined(token)),
				exhaustMap(() => store.select(IdentityState.clientId)),
				exhaustMap((clientId) => {
					if (clientId) {
						return of(clientId);
					}
					router.navigate(['/', 'identity', 'corridor']).then();
					return EMPTY;
				})
			)
		}),
	)
};
