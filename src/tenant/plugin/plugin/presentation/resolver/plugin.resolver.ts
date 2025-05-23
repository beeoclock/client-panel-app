import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import EPlugin from "@tenant/plugin/plugin/domain/entity/e.plugin-store";
import {IPlugin} from "@tenant/plugin/plugin/domain";

export const pluginResolver: ResolveFn<EPlugin | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const id = route.params.id;

	return sharedUow.plugin.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IPlugin.EntityRaw>),
		map((raw) => EPlugin.fromRaw(raw)),
	);

};
