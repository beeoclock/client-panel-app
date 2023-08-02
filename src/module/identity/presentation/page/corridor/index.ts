import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from '@identity/presentation/component/sign-in.component/sign-in.component';
import {Select, Store} from '@ngxs/store';
import {IdentityState} from "@identity/state/identity/identity.state";
import {filter, firstValueFrom, Observable, tap} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {IMember} from "@identity/domain/interface/i.member";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {IdentityApiAdapter} from "@identity/adapter/external/api/identity.api.adapter";
import {Auth} from "@angular/fire/auth";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {LogoutComponent} from "@utility/presentation/component/logout/logout.component";

@Component({
  selector: 'identity-corridor-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    SignInComponent,
    NgForOf,
    AsyncPipe,
    NgIf,
    LoaderComponent,
    TranslateModule,
    ChangeLanguageComponent,
    LogoutComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  public readonly store = inject(Store);
  public readonly router = inject(Router);
  public readonly auth = inject(Auth);
  public readonly identityApiAdapter = inject(IdentityApiAdapter);

  @Select(IdentityState.clients)
  public readonly clients$!: Observable<IMember[]>;

  public readonly members$ = this.clients$.pipe(
    filter((result) => Array.isArray(result)),
    tap((rest) => {
      this.loaderOn = false;
    })
  )

  @Select(IdentityState.clientId)
  public readonly clientId$!: Observable<string | undefined>;

  @HostBinding()
  public readonly class = 'w-96 p-8 dark:border-beeDarkColor-700 rounded dark:bg-beeDarkColor-800';

  public loaderOn = true;

  constructor() {

    this.store.dispatch(new IdentityActions.GetClients());

    // TODO get information about user's business clients
    // TODO check if localStorage has information about user's business clients
    // TODO check if localStorage has information about selected user's business client

    // TODO As user have selected business client to redirect the user to dashboard with selected business client

  }

  public async gotToCreateBusinessPage(): Promise<void> {
    await this.router.navigate(['/', 'identity', 'create-business']);
  }

  public async select(member: IMember): Promise<void> {
    // Switch business client by server side
    await firstValueFrom(
      this.identityApiAdapter.patchSwitchBusinessClient$({
        clientId: member.client._id
      })
    );
    // Refresh token and receive new claims
    await firstValueFrom(this.store.dispatch(new IdentityActions.InitToken()));
    const clientId = await firstValueFrom(this.clientId$);
    console.log(clientId, member);

    if (clientId === member.client._id) {
      await this.router.navigate(['/', 'dashboard']);
    }

  }

}