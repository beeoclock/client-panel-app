import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, of, switchMap} from "rxjs";
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

  const {employee}: { employee: IEmployeeState } = store.snapshot();

  if (employee?.item?.loading) {
    return EMPTY;
  }

  console.log(employee);

  if (employee.item?.data) {
    if (employee.item.data._id === id) {
      return employee.item.data;
    }
  }

  store.dispatch(new AppActions.PageLoading(true));

  return store.dispatch(new EmployeeActions.GetItem(id))
    .pipe(
      switchMap(({employee}: { employee: IEmployeeState }) => {
        store.dispatch(new AppActions.PageLoading(false));
        if (!employee.item.data) {
          return EMPTY;
        }
        return of(employee.item.data);
      }),
      catchError((error) => EMPTY)
    );
};
