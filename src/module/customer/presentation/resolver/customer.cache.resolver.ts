import {inject} from "@angular/core";
import {ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {catchError, EMPTY, map} from "rxjs";
import {IAppState} from "@utility/state/app/app.state";


export const customerCacheResolver: ResolveFn<boolean> = () => {

  const store = inject(Store); // NGXS

  const {app}: { app: IAppState } = store.snapshot();

  if (app?.pageLoading) {
    return EMPTY;
  }

  return store.dispatch(new CustomerActions.InitDefaultsFromCache())
    .pipe(
      map(() => true),
      catchError(() => EMPTY)
    );
};
