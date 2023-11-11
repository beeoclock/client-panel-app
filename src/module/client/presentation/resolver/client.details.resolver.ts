import {inject} from "@angular/core";
import {ResolveFn} from "@angular/router";
import {Store} from "@ngxs/store";
import {catchError, EMPTY, map} from "rxjs";
import {IAppState} from "@utility/state/app/app.state";
import {ClientActions} from "@client/state/client/client.actions";


export const clientDetailsResolver: ResolveFn<boolean> = () => {

  const store = inject(Store); // NGXS Store

  const {app}: { app: IAppState } = store.snapshot();

  if (app?.pageLoading) {
    return EMPTY;
  }

  return store.dispatch(new ClientActions.InitClient())
    .pipe(
      map(() => true),
      catchError(() => EMPTY)
    );
};
