import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, of, switchMap} from "rxjs";
import {IEmployeeState} from "@employee/state/employee/employee.state";
import {EmployeeActions} from "@employee/state/employee/employee.actions";
import {IEmployee} from "@employee/domain";
import {IAppState} from "@utility/state/app/app.state";

export const employeeDetailsResolver: ResolveFn<IEmployee> = (
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

  return store.dispatch(new EmployeeActions.GetItem(id))
    .pipe(
      switchMap(({employee}: { employee: IEmployeeState }) => {
        if (!employee.item.data) {
          return EMPTY;
        }
        return of(employee.item.data);
      }),
      catchError((error) => EMPTY)
    );
};
