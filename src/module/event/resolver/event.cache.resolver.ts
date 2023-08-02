import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, map} from "rxjs";
import {IAppState} from "@utility/state/app/app.state";
import {EventActions} from "@event/state/event/event.actions";


export const eventCacheResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store); // NGXS

  const {app}: { app: IAppState } = store.snapshot();

  if (app?.pageLoading) {
    return EMPTY;
  }

  return store.dispatch(new EventActions.InitDefaultsFromCache())
    .pipe(
      map(() => true),
      catchError(() => EMPTY)
    );
};