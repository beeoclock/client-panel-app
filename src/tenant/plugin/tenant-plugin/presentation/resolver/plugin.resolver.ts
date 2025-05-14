import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";
import {ITenantPlugin} from "@tenant/plugin/tenant-plugin/domain";

export const pluginResolver: ResolveFn<ETenantPlugin | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const id = route.params.id;

	return sharedUow.tenantPlugin.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<ITenantPlugin.EntityRaw>),
		map((item) => ETenantPlugin.fromRaw(item)),
	);

};
