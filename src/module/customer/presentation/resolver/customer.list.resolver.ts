import {inject} from "@angular/core";
import {ResolveFn, Router} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, map, tap} from "rxjs";
import {IAppState} from "@utility/state/app/app.state";
import {ITableState} from "@utility/domain/table.state";
import {ICustomer} from "@src/core/business-logic/customer";
import {CustomerActions} from "@customer/infrastructure/state/customer/customer.actions";
import {ICustomerState} from "@customer/infrastructure/state/customer/customer.state";

export const customerListResolver: ResolveFn<ITableState<ICustomer.EntityRaw>> = () => {

	const store = inject(Store); // NGXS
	const router = inject(Router);

	const {app}: { app: IAppState } = store.snapshot();

	if (app?.pageLoading) {
		return EMPTY;
	}

	return store.dispatch(new CustomerActions.GetList())
		.pipe(
			map(({event}) => event),
			map(({tableState}: ICustomerState) => tableState),
			tap(({total}) => {
				if (!total) {
					router.navigate(['/', 'customer', 'starter']).then();
				}
			}),
			catchError(() => EMPTY)
		);
};
