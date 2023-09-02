import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {IdentityState} from "@identity/state/identity/identity.state";
import {inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {EMPTY, exhaustMap, of} from "rxjs";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {IdTokenResult} from "@angular/fire/auth";


export const tokenResolver: ResolveFn<IdTokenResult | undefined> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store);

  return store.select(IdentityState.token).pipe(
    exhaustMap((token) => {
      console.log('token1:', token);
      if (token) {
        return of(token);
      }
      return store.dispatch(new IdentityActions.InitToken()).pipe(
        exhaustMap(() => store.select(IdentityState.token)),
        exhaustMap((token) => {
          console.log('token2: ', token);
          if (token) {
            return of(token);
          }
          return EMPTY;
        })
      )
    }),
  )
};
