import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {ICustomer} from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {catchError, EMPTY, of, switchMap} from "rxjs";
import {ICustomerState} from "@customer/state/customer/customer.state";
import {IAppState} from "@utility/state/app/app.state";


export const customerDetailsResolver: ResolveFn<ICustomer> = (
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

  console.log(app, id);

  return store.dispatch(new CustomerActions.GetItem(id))
    .pipe(
      switchMap(({customer}: { customer: ICustomerState }) => {
        if (!customer.item.data) {
          return EMPTY;
        }
        return of(customer.item.data);
      }),
      catchError((error) => EMPTY)
    );
};
