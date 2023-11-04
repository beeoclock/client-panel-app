import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY} from "rxjs";
import {IService} from "@service/domain";
import {ServiceActions} from "@service/state/service/service.actions";
import {IAppState} from "@utility/state/app/app.state";

export const serviceDetailsResolver: ResolveFn<IService> = (
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

	return store.dispatch(new ServiceActions.GetItem(id))
		.pipe(
			catchError((error) => EMPTY)
		);
};
