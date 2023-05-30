import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {ICustomer} from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {catchError, EMPTY, tap} from "rxjs";
import {ICustomerState} from "@customer/state/customer/customer.state";
import {AppActions} from "@utility/state/app/app.actions";


export const customerDetailsResolver: ResolveFn<ICustomer> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store); // NGXS
  const id = route.paramMap.get('id');

  if (!id) {
    return EMPTY;
  }

  const state: ICustomerState = store.snapshot();

  if (state?.item?.loading) {
    return EMPTY;
  }

  store.dispatch(new AppActions.PageLoading(true));

  return store.dispatch(new CustomerActions.GetItem(id))
    .pipe(
      tap(() => store.dispatch(new AppActions.PageLoading(false))),
      catchError((error) => EMPTY)
    );
};
