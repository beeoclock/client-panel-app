import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import ECustomer from "@tenant/customer/domain/entity/e.customer";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {ICustomer} from "@tenant/customer/domain";
import {is} from "@core/shared/checker";

export const pluginResolver: ResolveFn<ECustomer | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const customerId = route.params.id;

	return sharedUow.customer.repository.findById$(customerId).pipe(
		filter(is.not_null_or_undefined<ICustomer.EntityRaw>),
		map((customer) => ECustomer.fromRaw(customer)),
	);

};
