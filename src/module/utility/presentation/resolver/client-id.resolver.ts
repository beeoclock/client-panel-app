import {ResolveFn, Router} from "@angular/router";
import {IdentityState} from "@identity/state/identity/identity.state";
import {inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {EMPTY, exhaustMap, filter, of} from "rxjs";
import {is} from "thiis";
import {TENANT_ID} from "@src/token";

export const clientIdResolver: ResolveFn<string | undefined> = () => {

	const store = inject(Store);
	const tenantId$ = inject(TENANT_ID);
	const router = inject(Router);

	return tenantId$.pipe(
		exhaustMap((clientId) => {
			if (clientId) {
				return of(clientId);
			}
			return store.select(IdentityState.token).pipe(
				filter((token) => is.not_undefined(token)),
				exhaustMap(() => tenantId$),
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
