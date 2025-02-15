import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, of, switchMap} from "rxjs";

import {IServiceState} from "@service/infrastructure/state/service/service.state";
import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {ItemServiceApiAdapter} from "@service/infrastructure/api/item.service.api.adapter";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";

export const eventServiceResolver: ResolveFn<IServiceDto | undefined> = (
	route: ActivatedRouteSnapshot,
) => {

	const store = inject(Store); // NGXS
	const itemServiceApiAdapter = inject(ItemServiceApiAdapter); // NGXS

	const {serviceId} = route.queryParams;

	if (!serviceId) {
		return undefined;
	}

	return store
		.selectOnce((state: { service: IServiceState; }) => state.service.tableState.items)
		.pipe(
			switchMap((services) => {
				if (services?.length) {
					const service = services.find((service: IServiceDto) => service._id === serviceId);
					if (!service) {
						return store.dispatch(new ServiceActions.GetItem(serviceId));
					}
					// Data from store is immutable, so we need to return a new object
					return of({...service});
				}
				return itemServiceApiAdapter.execute$(serviceId);
			}),
			catchError(() => EMPTY),
		);

};
