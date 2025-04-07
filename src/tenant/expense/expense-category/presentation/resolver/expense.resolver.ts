import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import ECustomer from "@tenant/customer/domain/entity/e.customer";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import EExpense from "@tenant/expense/expense/domain/entity/e.expense";
import {IExpense} from "@tenant/expense/expense/domain";

export const expenseResolver: ResolveFn<ECustomer | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const id = route.params.id;

	return sharedUow.expense.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IExpense.EntityRaw>),
		map((item) => EExpense.fromRaw(item)),
	);

};
