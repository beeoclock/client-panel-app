import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, of, switchMap} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {IEventState} from "@event/state/event/event.state";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";

export const eventDetailsResolver: ResolveFn<IEvent> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store); // NGXS
  const id = route.paramMap.get('id');

  if (!id) {
    return EMPTY;
  }

  const {event}: { event: IEventState } = store.snapshot();

  if (event?.item?.loading) {
    return EMPTY;
  }

  console.log(event);

  if (event.item?.data) {
    if (event.item.data._id === id) {
      return event.item.data;
    }
  }

  store.dispatch(new AppActions.PageLoading(true));

  return store.dispatch(new EventActions.GetItem(id))
    .pipe(
      switchMap(({event}: { event: IEventState }) => {
        store.dispatch(new AppActions.PageLoading(false));
        if (!event.item.data) {
          return EMPTY;
        }
        return of(event.item.data);
      }),
      catchError((error) => EMPTY)
    );
};
