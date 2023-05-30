import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, tap} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {IEmployeeState} from "@employee/state/employee/employee.state";
import {EmployeeActions} from "@employee/state/employee/employee.actions";
import {IEmployee} from "@employee/domain";

export const employeeDetailsResolver: ResolveFn<IEmployee> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store); // NGXS
  const id = route.paramMap.get('id');

  if (!id) {
    return EMPTY;
  }

  const state: IEmployeeState = store.snapshot();

  if (state?.item?.loading) {
    return EMPTY;
  }

  store.dispatch(new AppActions.PageLoading(true));

  return store.dispatch(new EmployeeActions.GetItem(id))
    .pipe(
      tap(() => store.dispatch(new AppActions.PageLoading(false))),
      catchError((error) => EMPTY)
    );
};
