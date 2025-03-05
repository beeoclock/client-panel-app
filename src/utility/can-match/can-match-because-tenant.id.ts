import {CanMatchFn, RedirectCommand, Route, Router, UrlSegment} from "@angular/router";
import {inject} from "@angular/core";
import {TENANT_ID} from "@src/token";

export const canMatchBecauseTenantId: CanMatchFn = (route: Route, segments: UrlSegment[]) => {

	const {0: {path: tenantId}} = segments;

	if (!tenantId) {

		const router = inject(Router);

		const toCorridor = router.parseUrl("/identity/corridor");

		return new RedirectCommand(toCorridor, {
			skipLocationChange: true,
		});

	}


	const tenantId$ = inject(TENANT_ID);
	if (tenantId$.value !== tenantId) {
		tenantId$.next(tenantId);
	}
	return true;

};
