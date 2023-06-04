import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {catchError, EMPTY} from "rxjs";


export const customerListResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store); // NGXS

  // TODO check if we have list, check page and when the last update was!

  if (Object.keys(route.queryParams).length) {
    return store.dispatch(new CustomerActions.UpdatePaginationFromQueryParams(route.queryParams))
      .pipe(
        catchError(() => EMPTY)
      );
  } else {
    return store.dispatch(new CustomerActions.UpdateQueryParamsAtNavigator([_state.url]))
      .pipe(
        catchError(() => EMPTY)
      );
  }
};
