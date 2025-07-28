import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import EOrder from "@tenant/order/order/domain/entity/e.order";

export const orderResolver: ResolveFn<EOrder | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const {id} = route.params;

	return sharedUow.order.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IOrder.EntityRaw>),
		map((item) => EOrder.fromRaw(item)),
	);

};
