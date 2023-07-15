import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from '@identity/presentation/component/sign-in.component/sign-in.component';
import {Select, Store} from '@ngxs/store';
import {IdentityState} from "@identity/state/identity/identity.state";
import {Observable} from "rxjs";
import {AsyncPipe, NgForOf} from "@angular/common";
import {IMember} from "@identity/domain/interface/i.member";
import {IdentityActions} from "@identity/state/identity/identity.actions";

@Component({
  selector: 'identity-corridor-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    SignInComponent,
    NgForOf,
    AsyncPipe
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  public readonly store = inject(Store);
  public readonly router = inject(Router);

  @Select(IdentityState.clients)
  public readonly members$!: Observable<IMember[]>;

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

  public select(member: IMember): void {
    console.log(member);
  }

}
