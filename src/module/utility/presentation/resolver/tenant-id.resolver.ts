import {ResolveFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {EMPTY, exhaustMap, of} from "rxjs";
import {TENANT_ID} from "@src/token";

export const tenantIdResolver: ResolveFn<string | undefined> = (route, state) => {

	const tenantId$ = inject(TENANT_ID);
	const router = inject(Router);

	return tenantId$.pipe(
		exhaustMap((existTenantId) => {

			if (existTenantId) {
				return of(existTenantId);
			}

			const {tenantId} = route.params;

			if (!tenantId) {
				router.navigate(['/', 'identity', 'corridor']).then();
				return EMPTY;
			}

			tenantId$.next(tenantId);
			return of(tenantId);

		}),
	)
};
