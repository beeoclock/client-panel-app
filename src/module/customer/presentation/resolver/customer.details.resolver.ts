import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, map, of} from "rxjs";
import {IAppState} from "@utility/state/app/app.state";
import ECustomer from "@core/entity/e.customer";


export const customerDetailsResolver: ResolveFn<boolean> = (
	route: ActivatedRouteSnapshot,
) => {

	const store = inject(Store); // NGXS
	const customerStore = inject(ECustomer.store);
	const id = route.paramMap.get('id');

	if (!id) {
		return EMPTY;
	}

	const {app}: { app: IAppState } = store.snapshot();

	if (app?.pageLoading) {
		return EMPTY;
	}

	return of(customerStore.getItem(id)).pipe(
		map(() => true),
		catchError(() => EMPTY)
	);

};
