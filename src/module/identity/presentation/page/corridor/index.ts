import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from '@identity/presentation/component/sign-in.component/sign-in.component';
import {Select, Store} from '@ngxs/store';
import {IdentityState} from "@identity/state/identity/identity.state";
import {firstValueFrom, Observable} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {IMember} from "@identity/domain/interface/i.member";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {IdentityApiAdapter} from "@identity/adapter/external/api/identity.api.adapter";
import {Auth} from "@angular/fire/auth";

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
    NgIf
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  public readonly store = inject(Store);
  public readonly router = inject(Router);
  public readonly auth = inject(Auth);
  public readonly identityApiAdapter = inject(IdentityApiAdapter);

  @Select(IdentityState.clients)
  public readonly members$!: Observable<IMember[]>;

  @Select(IdentityState.clientId)
  public readonly clientId$!: Observable<string | undefined>;

  @HostBinding()
  public readonly class = 'w-96 p-8 dark:border-beeDarkColor-700 rounded dark:bg-beeDarkColor-800';

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
    console.log(member);
    console.log(member.client._id);
    // Switch business client by server side
    await firstValueFrom(
      this.identityApiAdapter.patchSwitchBusinessClient$({
        clientId: member.client._id
      })
    );
    // Refresh token and receive new claims
    await firstValueFrom(this.store.dispatch(new IdentityActions.InitToken()));
    const clientId = await firstValueFrom(this.clientId$);

    console.log(clientId);

    if (clientId === member.client._id) {
      console.log('SUCCESS');
      await this.router.navigate(['/', 'dashboard']);
    }

  }

}
