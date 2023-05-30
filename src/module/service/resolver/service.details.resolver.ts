import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, tap} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {IService} from "@service/domain";
import {IServiceState} from "@service/state/service/service.state";
import {ServiceActions} from "@service/state/service/service.actions";

export const serviceDetailsResolver: ResolveFn<IService> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store); // NGXS
  const id = route.paramMap.get('id');

  if (!id) {
    return EMPTY;
  }

  const state: IServiceState = store.snapshot();

  if (state?.item?.loading) {
    return EMPTY;
  }

  store.dispatch(new AppActions.PageLoading(true));

  return store.dispatch(new ServiceActions.GetItem(id))
    .pipe(
      tap(() => store.dispatch(new AppActions.PageLoading(false))),
      catchError((error) => EMPTY)
    );
};
