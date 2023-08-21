import {Component, HostBinding, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from '@identity/presentation/component/sign-in.component/sign-in.component';
import {Select, Store} from '@ngxs/store';
import {IdentityState} from "@identity/state/identity/identity.state";
import {filter, firstValueFrom, Observable, tap} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {IMember} from "@identity/domain/interface/i.member";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {IdentityApiAdapter} from "@identity/adapter/external/api/identity.api.adapter";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {LogoutComponent} from "@utility/presentation/component/logout/logout.component";
import {BooleanState} from "@utility/domain";

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
export default class Index implements OnInit {

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly identityApiAdapter = inject(IdentityApiAdapter);

  @Select(IdentityState.clients)
  public readonly clients$!: Observable<IMember[]>;

  public readonly members$ = this.clients$.pipe(
    filter((result) => Array.isArray(result)),
    tap(() => {
      this.loader.switchOff();
    })
  )

  @Select(IdentityState.clientId)
  public readonly clientId$!: Observable<string | undefined>;

  @HostBinding()
  public readonly class = 'w-96 p-8 dark:border-beeDarkColor-700 rounded dark:bg-beeDarkColor-800';

  public readonly loader = new BooleanState(true);

  constructor() {

    this.store.dispatch(new IdentityActions.GetClients());

    // TODO get information about user's business clients
    // TODO check if localStorage has information about user's business clients
    // TODO check if localStorage has information about selected user's business client

    // TODO As user have selected business client to redirect the user to dashboard with selected business client

  }

  public ngOnInit(): void {

    this.clientId$.pipe(
      filter((result) => !!result),
      filter(() => !('force' in this.activatedRoute.snapshot.queryParams))
    ).subscribe(() => {
      this.router.navigate(['/', 'dashboard']);
    });

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

    if (clientId === member.client._id) {
      await this.router.navigate(['/', 'dashboard']);
    }

  }

}
