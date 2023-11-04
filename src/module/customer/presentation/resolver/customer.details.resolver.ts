import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {catchError, EMPTY, map} from "rxjs";
import {IAppState} from "@utility/state/app/app.state";


export const customerDetailsResolver: ResolveFn<boolean> = (
	route: ActivatedRouteSnapshot,
) => {

	const store = inject(Store); // NGXS
	const id = route.paramMap.get('id');

	if (!id) {
		return EMPTY;
	}

	const {app}: { app: IAppState } = store.snapshot();

	if (app?.pageLoading) {
		return EMPTY;
	}

	return store.dispatch(new CustomerActions.GetItem(id))
		.pipe(
			map(() => true),
			catchError(() => EMPTY)
		);
};
