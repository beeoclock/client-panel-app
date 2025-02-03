import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, of, switchMap} from "rxjs";
import {ItemCustomerApiAdapter} from "@customer/adapter/external/api/item.customer.api.adapter";
import {ICustomer} from "@customer/domain";
import {ICustomerState} from "@customer/state/customer/customer.state";
import ECustomer from "@core/entity/e.customer";

export const eventCustomerResolver: ResolveFn<ICustomer | undefined> = (
	route: ActivatedRouteSnapshot,
) => {

	const store = inject(Store); // NGXS
	const customerStore = inject(ECustomer.store);
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
						return of(customerStore.getItem(customerId));
					}
					return of(customer);
				}
				return itemCustomerApiAdapter.execute$(customerId);
			}),
			catchError(() => EMPTY),
		);

};
