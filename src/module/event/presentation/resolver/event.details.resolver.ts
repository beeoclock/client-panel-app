import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, map} from "rxjs";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";

export const eventDetailsResolver: ResolveFn<IEvent> = (
	route: ActivatedRouteSnapshot,
) => {

	const store = inject(Store); // NGXS
	const id = route.paramMap.get('id');

	if (!id) {
		return EMPTY;
	}

	return store.dispatch(new EventActions.GetItem(id))
		.pipe(
			map(({event}) => event),
			map(({item}) => item),
			map(({data}) => data),
			catchError(() => EMPTY)
		);
};
