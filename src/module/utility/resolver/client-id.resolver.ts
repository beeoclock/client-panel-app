import {ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot} from "@angular/router";
import {IdentityState} from "@identity/state/identity/identity.state";
import {inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {EMPTY, of, switchMap} from "rxjs";


export const clientIdResolver: ResolveFn<string | undefined> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store);
  const router = inject(Router);

  return store.select(IdentityState.clientId).pipe(
    switchMap((clientId) => {
      if (clientId) {
        return of(clientId);
      }
      router.navigate(['/', 'identity', 'corridor']);
      return EMPTY;
    })
  );
};
