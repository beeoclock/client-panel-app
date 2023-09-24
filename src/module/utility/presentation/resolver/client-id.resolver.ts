import {ResolveFn, Router} from "@angular/router";
import {IdentityState} from "@identity/state/identity/identity.state";
import {inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {EMPTY, exhaustMap, of} from "rxjs";
import {IdentityActions} from "@identity/state/identity/identity.actions";


export const clientIdResolver: ResolveFn<string | undefined> = () => {

	const store = inject(Store);
	const router = inject(Router);

	return store.select(IdentityState.clientId).pipe(
		exhaustMap((clientId) => {
			if (clientId) {
				return of(clientId);
			}
			return store.dispatch(new IdentityActions.InitToken()).pipe(
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
