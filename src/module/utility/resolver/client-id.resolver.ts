import {ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot} from "@angular/router";
import {IdentityState} from "@identity/state/identity/identity.state";
import {inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {EMPTY, exhaustMap, firstValueFrom, from, of, switchMap} from "rxjs";
import {Auth, User} from "@angular/fire/auth";
import {IdentityActions} from "@identity/state/identity/identity.actions";


export const clientIdResolver: ResolveFn<string | undefined> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const store = inject(Store);
  const auth = inject(Auth);
  const router = inject(Router);

  console.log('clientIdResolver: 1');

  // Firebase Authorization
  const auth$ = from(new Promise<User | null>((resolve) => {
    auth.onAuthStateChanged(async (user) => {

      console.log('clientIdResolver: 2');
      await firstValueFrom(store.dispatch(new IdentityActions.InitToken()));


      console.log('clientIdResolver: 3');
      resolve(user);
    })
  }));

  return auth$.pipe(
    exhaustMap(() => {
      return store.select(IdentityState.clientId).pipe(
        switchMap((clientId) => {

          console.log('clientIdResolver: 4');
          if (clientId) {
            return of(clientId);
          }
          router.navigate(['/', 'identity', 'corridor']);
          return EMPTY;
        })
      );
    })
  )
};
