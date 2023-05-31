import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, tap} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {EventActions} from "@event/state/event/event.actions";


export const eventListResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store); // NGXS
  store.dispatch(new AppActions.PageLoading(true));

  if (Object.keys(route.queryParams).length) {
    return store.dispatch(new EventActions.UpdatePaginationFromQueryParams(route.queryParams))
      .pipe(
        tap(() => store.dispatch(new AppActions.PageLoading(false))),
        catchError(() => EMPTY)
      );
  } else {
    return store.dispatch(new EventActions.UpdateQueryParamsAtNavigator([_state.url]))
      .pipe(
        catchError(() => EMPTY)
      );
  }
};
