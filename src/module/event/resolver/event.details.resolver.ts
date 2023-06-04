import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, of, switchMap} from "rxjs";
import {IEventState} from "@event/state/event/event.state";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";
import {IAppState} from "@utility/state/app/app.state";

export const eventDetailsResolver: ResolveFn<IEvent> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store); // NGXS
  const id = route.paramMap.get('id');

  if (!id) {
    return EMPTY;
  }

  const {app}: { app: IAppState } = store.snapshot();

  if (app.pageLoading) {
    return EMPTY;
  }

  return store.dispatch(new EventActions.GetItem(id))
    .pipe(
      switchMap(({event}: { event: IEventState }) => {
        if (!event.item.data) {
          return EMPTY;
        }
        return of(event.item.data);
      }),
      catchError((error) => EMPTY)
    );
};
