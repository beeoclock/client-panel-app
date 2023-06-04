import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY} from "rxjs";
import {EmployeeActions} from "@employee/state/employee/employee.actions";


export const employeeListResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store); // NGXS

  if (Object.keys(route.queryParams).length) {
    return store.dispatch(new EmployeeActions.UpdatePaginationFromQueryParams(route.queryParams))
      .pipe(
        catchError(() => EMPTY)
      );
  } else {
    return store.dispatch(new EmployeeActions.UpdateQueryParamsAtNavigator([_state.url]))
      .pipe(
        catchError(() => EMPTY)
      );
  }
};
