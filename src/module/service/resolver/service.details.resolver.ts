import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, of, switchMap} from "rxjs";
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

  const {service}: { service: IServiceState } = store.snapshot();

  if (service?.item?.loading) {
    return EMPTY;
  }

  console.log(service);

  if (service.item?.data) {
    if (service.item.data._id === id) {
      return service.item.data;
    }
  }

  store.dispatch(new AppActions.PageLoading(true));

  return store.dispatch(new ServiceActions.GetItem(id))
    .pipe(
      switchMap(({service}: { service: IServiceState }) => {
        store.dispatch(new AppActions.PageLoading(false));
        if (!service.item.data) {
          return EMPTY;
        }
        return of(service.item.data);
      }),
      catchError((error) => EMPTY)
    );
};
