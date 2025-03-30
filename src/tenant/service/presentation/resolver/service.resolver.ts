import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import EOrder from "@tenant/order/domain/entity/e.order";
import {IOrder} from "@tenant/order/domain/interface/i.order";

export const serviceResolver: ResolveFn<EOrder | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const {id} = route.params;

	return sharedUow.order.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IOrder.EntityRaw>),
		map((item) => EOrder.fromRaw(item)),
	);

};
