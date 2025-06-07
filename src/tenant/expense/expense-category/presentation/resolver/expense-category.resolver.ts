import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";
import EExpenseCategory from "@tenant/expense/expense-category/domain/entity/e.expense-category";

export const expenseCategoryResolver: ResolveFn<EExpenseCategory | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const id = route.params.id;

	return sharedUow.expenseCategory.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IExpenseCategory.EntityRaw>),
		map((item) => EExpenseCategory.fromRaw(item)),
	);

};
