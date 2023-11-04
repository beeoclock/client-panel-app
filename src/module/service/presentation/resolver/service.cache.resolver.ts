import {inject} from "@angular/core";
import {ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, map} from "rxjs";
import {IAppState} from "@utility/state/app/app.state";
import {ServiceActions} from "@service/state/service/service.actions";


export const serviceCacheResolver: ResolveFn<boolean> = () => {

	const store = inject(Store); // NGXS

	const {app}: { app: IAppState } = store.snapshot();

	if (app?.pageLoading) {
		return EMPTY;
	}

	return store.dispatch(new ServiceActions.InitDefaultsFromCache())
		.pipe(
			map(() => true),
			catchError(() => EMPTY)
		);
};
