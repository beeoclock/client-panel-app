import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import {IBalance} from "@tenant/balance/domain";
import EBalance from "@tenant/balance/domain/entity/e.balance";

export const balanceResolver: ResolveFn<EBalance | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const id = route.params.id;

	return sharedUow.balance.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IBalance.EntityRaw>),
		map((raw) => EBalance.fromRaw(raw)),
	);

};
