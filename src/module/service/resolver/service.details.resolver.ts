import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, of, switchMap} from "rxjs";
import {IService} from "@service/domain";
import {IServiceState} from "@service/state/service/service.state";
import {ServiceActions} from "@service/state/service/service.actions";
import {IAppState} from "@utility/state/app/app.state";

export const serviceDetailsResolver: ResolveFn<IService> = (
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

  return store.dispatch(new ServiceActions.GetItem(id))
    .pipe(
      switchMap(({service}: { service: IServiceState }) => {
        if (!service.item.data) {
          return EMPTY;
        }
        return of(service.item.data);
      }),
      catchError((error) => EMPTY)
    );
};
