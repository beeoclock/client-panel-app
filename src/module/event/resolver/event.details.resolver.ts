import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, tap} from "rxjs";
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

  const state: IEventState = store.snapshot();

  if (state?.item?.loading) {
    return EMPTY;
  }

  store.dispatch(new AppActions.PageLoading(true));

  return store.dispatch(new EventActions.GetItem(id))
    .pipe(
      tap(() => store.dispatch(new AppActions.PageLoading(false))),
      catchError((error) => EMPTY)
    );
};
