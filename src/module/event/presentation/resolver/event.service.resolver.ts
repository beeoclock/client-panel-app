import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, of, switchMap} from "rxjs";
import {IService} from "@service/domain";
import {IServiceState} from "@service/state/service/service.state";
import {ServiceActions} from "@service/state/service/service.actions";
import {ItemServiceApiAdapter} from "@service/adapter/external/api/item.service.api.adapter";

export const eventServiceResolver: ResolveFn<IService | undefined> = (
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
					const service = services.find((service: IService) => service._id === serviceId);
					if (!service) {
						return store.dispatch(new ServiceActions.GetItem(serviceId));
					}
					return of(service);
				}
				return itemServiceApiAdapter.execute$(serviceId);
			}),
			catchError(() => EMPTY),
		);

};
