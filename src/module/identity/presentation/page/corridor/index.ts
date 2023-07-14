import {Component, HostBinding, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from '@identity/presentation/component/sign-in.component/sign-in.component';
import {AppActions} from "@utility/state/app/app.actions";
import {Select, Store} from '@ngxs/store';
import {IdentityState} from "@identity/state/identity/identity.state";
import {Observable} from "rxjs";
import {IdTokenResult} from "@angular/fire/auth";
import {BeeoclockParsedToken} from "@utility/presentation/page/dashboard";

@Component({
  selector: 'identity-corridor-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    SignInComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index implements OnInit {

  public readonly store = inject(Store);
  public readonly router = inject(Router);

  @Select(IdentityState.token)
  public readonly token$!: Observable<IdTokenResult | undefined>;

  @HostBinding()
  public readonly class = 'w-96 p-8 border dark:border-beeDarkColor-700 bg-white rounded dark:bg-beeDarkColor-800';

  public ngOnInit(): void {
    this.store.dispatch(new AppActions.PageLoading(false));

    this.token$.subscribe((token) => {
      console.log(token);
      if (token) {
        const claims: BeeoclockParsedToken = token.claims as BeeoclockParsedToken;
        console.log(claims.clientId);
        if (claims.clientId) {
          this.router.navigate(['/', 'dashboard']);
        }
      }
    });

    // TODO get information about user's business clients
    // TODO check if localStorage has information about user's business clients
    // TODO check if localStorage has information about selected user's business client

    // TODO As user have selected business client to redirect the user to dashboard with selected business client

  }

}
