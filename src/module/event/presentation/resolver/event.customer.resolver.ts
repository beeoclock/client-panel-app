import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, of, switchMap} from "rxjs";
import {ItemCustomerApiAdapter} from "@customer/infrastructure/api/item.customer.api.adapter";
import {ICustomer} from "@src/core/business-logic/customer";
import {ICustomerState} from "@customer/infrastructure/state/customer/customer.state";
import {CustomerActions} from "@customer/infrastructure/state/customer/customer.actions";

export const eventCustomerResolver: ResolveFn<ICustomer | undefined> = (
	route: ActivatedRouteSnapshot,
) => {

	const store = inject(Store); // NGXS
	const itemCustomerApiAdapter = inject(ItemCustomerApiAdapter); // NGXS

	const {customerId} = route.queryParams;

	if (!customerId) {
		return undefined;
	}

	return store
		.selectOnce((state: { customer: ICustomerState; }) => state.customer.tableState.items)
		.pipe(
			switchMap((customers) => {
				if (customers?.length) {
					const customer = customers.find((customer: ICustomer) => customer._id === customerId);
					if (!customer) {
						return store.dispatch(new CustomerActions.GetItem(customerId));
					}
					return of(customer);
				}
				return itemCustomerApiAdapter.execute$(customerId);
			}),
			catchError(() => EMPTY),
		);

};
