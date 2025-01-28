import {ResolveFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {EMPTY, of} from "rxjs";
import {TENANT_ID} from "@src/token";
import ECustomer from "@core/entity/e.customer";

export const tenantIdResolver: ResolveFn<string | undefined> = (route) => {

	const tenantId$ = inject(TENANT_ID);
	const router = inject(Router);

	let tenantId = tenantId$.value;

	if (!tenantId) {

		tenantId = route.params.tenantId;

		if (!tenantId) {
			router.navigate(['/', 'identity', 'corridor']).then();
			return EMPTY;
		}

		tenantId$.next(tenantId);

	}

	ECustomer.initDatabase(tenantId);

	return of(tenantId);

};
