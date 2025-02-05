import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY} from "rxjs";

import {ServiceActions} from "@service/state/service/service.actions";
import {IAppState} from "@utility/state/app/app.state";
import {IServiceDto} from "@order/domain/interface/i.service.dto";

export const serviceDetailsResolver: ResolveFn<IServiceDto> = (
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
