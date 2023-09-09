import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, map, tap} from "rxjs";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";
import {IAppState} from "@utility/state/app/app.state";
import {IEventState} from "@event/state/event/event.state";
import {ITableState} from "@utility/domain/table.state";

export const eventListResolver: ResolveFn<ITableState<IEvent>> = (
	route: ActivatedRouteSnapshot,
	_state: RouterStateSnapshot
) => {

	const store = inject(Store); // NGXS
	const router = inject(Router);

	const {app}: { app: IAppState } = store.snapshot();

	if (app?.pageLoading) {
		return EMPTY;
	}

	return store.dispatch(new EventActions.GetList())
		.pipe(
			map(({event}) => event),
			map(({tableState}: IEventState) => tableState),
			tap(({total}) => {
				if (!total) {
					router.navigate(['/', 'event', 'starter']);
				}
			}),
			catchError(() => EMPTY)
		);
};
