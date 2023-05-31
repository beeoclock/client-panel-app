import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, tap} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {ServiceActions} from "@service/state/service/service.actions";


export const serviceListResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store); // NGXS
  store.dispatch(new AppActions.PageLoading(true));

  if (Object.keys(route.queryParams).length) {
    return store.dispatch(new ServiceActions.UpdatePaginationFromQueryParams(route.queryParams))
      .pipe(
        tap(() => store.dispatch(new AppActions.PageLoading(false))),
        catchError(() => EMPTY)
      );
  } else {
    return store.dispatch(new ServiceActions.UpdateQueryParamsAtNavigator([_state.url]))
      .pipe(
        catchError(() => EMPTY)
      );
  }
};
