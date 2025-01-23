import {ResolveFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {EMPTY, of} from "rxjs";
import {TENANT_ID} from "@src/token";
import {TenantDatabaseService} from "@src/database/tenant/tenant.database.service";

export const tenantIdResolver: ResolveFn<string | undefined> = (route) => {

	const tenantId$ = inject(TENANT_ID);
	const router = inject(Router);

	if (tenantId$.value) {
		return of(tenantId$.value);
	}

	const {tenantId} = route.params;

	if (!tenantId) {
		router.navigate(['/', 'identity', 'corridor']).then();
		return EMPTY;
	}

	tenantId$.next(tenantId);

	// Ініціалізація бази даних для держави
	const tenantDatabaseService = inject(TenantDatabaseService);
	tenantDatabaseService.init(tenantId);

	return of(tenantId);

};
