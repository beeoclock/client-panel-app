import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {ICustomer} from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {catchError, EMPTY, of, switchMap} from "rxjs";
import {ICustomerState} from "@customer/state/customer/customer.state";
import {AppActions} from "@utility/state/app/app.actions";


export const customerFormResolver: ResolveFn<ICustomer> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  console.log(route, _state);

  const store = inject(Store); // NGXS
  const id = route.paramMap.get('id');

  if (!id) {
    return EMPTY;
  }

  const {customer}: {customer: ICustomerState} = store.snapshot();

  if (customer?.item?.loading) {
    return EMPTY;
  }

  console.log(customer);

  if (customer.item?.data) {
    if (customer.item.data._id === id) {
      return customer.item.data;
    }
  }

  store.dispatch(new AppActions.PageLoading(true));

  return store.dispatch(new CustomerActions.GetItem(id))
    .pipe(
      switchMap(({customer}: { customer: ICustomerState }) => {
        store.dispatch(new AppActions.PageLoading(false));
        if (!customer.item.data) {
          return EMPTY;
        }
        return of(customer.item.data);
      }),
      catchError((error) => EMPTY)
    );
};
