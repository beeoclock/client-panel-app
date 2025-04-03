import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import EPayment from "@tenant/payment/domain/entity/e.payment";
import {IPayment} from "@tenant/payment/domain/interface/i.payment";

export const paymentResolver: ResolveFn<EPayment | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const {id} = route.params;

	return sharedUow.payment.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IPayment.EntityRaw>),
		map((item) => EPayment.fromRaw(item)),
	);

};
