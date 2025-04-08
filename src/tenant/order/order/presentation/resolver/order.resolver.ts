import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import {IService} from "@tenant/service/domain/interface/i.service";
import EService from "@tenant/service/domain/entity/e.service";

export const orderResolver: ResolveFn<EService | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const {id} = route.params;

	return sharedUow.order.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IService.EntityRaw>),
		map((item) => EService.fromRaw(item)),
	);

};
