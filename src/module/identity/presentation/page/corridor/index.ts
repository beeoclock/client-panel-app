import {Component, HostBinding, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from '@identity/presentation/component/sign-in.component/sign-in.component';
import {Select, Store} from '@ngxs/store';
import {IdentityState} from "@identity/state/identity/identity.state";
import {filter, from, Observable, switchMap, tap} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {IMember} from "@identity/domain/interface/i.member";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {IdentityApiAdapter} from "@identity/adapter/external/api/identity.api.adapter";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {LogoutComponent} from "@utility/presentation/component/logout/logout.component";
import {BooleanState} from "@utility/domain";
import {AppActions} from "@utility/state/app/app.actions";
import {Reactive} from "@utility/cdk/reactive";

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
export default class Index extends Reactive implements OnInit {

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly identityApiAdapter = inject(IdentityApiAdapter);

  @Select(IdentityState.clients)
  private readonly clients$!: Observable<IMember[]>;

  @Select(IdentityState.clientId)
  private readonly clientId$!: Observable<string | undefined>;

  public readonly members$ = this.clients$.pipe(
    filter(Array.isArray),
    tap((result) => {
      if (result.length === 0) {
        this.gotToCreateBusinessPage({
          firstCompany: true
        });
      }
      this.loader.switchOff();
    })
  );

  @HostBinding()
  public readonly class = 'w-96 p-8 dark:border-beeDarkColor-700 rounded dark:bg-beeDarkColor-800';

  public readonly loader = new BooleanState(true);
  public readonly disabled = new BooleanState(false);

  public ngOnInit(): void {

    this.store.dispatch(new IdentityActions.GetClients());

    this.clientId$.pipe(
      filter((result) => !!result),
      filter(() => !('force' in this.activatedRoute.snapshot.queryParams)),
      switchMap(() => from(this.gotToDashboardPage()))
    ).subscribe();

  }

  public async gotToCreateBusinessPage(queryParams = {}): Promise<boolean> {
    return this.router.navigate(['/', 'identity', 'create-business'], {
      queryParams
    });
  }

  public async gotToDashboardPage(): Promise<boolean> {
    return this.router.navigate(['/', 'dashboard']);
  }

  public async select(member: IMember): Promise<void> {
    this.disabled.switchOn();

    this.store.dispatch(new AppActions.PageLoading(true)).pipe(
      // Switch business client by server side
      switchMap(() => this.identityApiAdapter.patchSwitchBusinessClient$({
        clientId: member.client._id
      })),
      // Refresh token and receive new claims
      tap(() => this.store.dispatch(new IdentityActions.InitToken())),
      switchMap(() => this.clientId$),
      filter((clientId) => clientId === member.client._id),
      tap(() => this.store.dispatch(new AppActions.PageLoading(false))),
      switchMap(() => from(this.gotToDashboardPage())),
      this.takeUntil(),
    ).subscribe({
      error: () => {
        this.disabled.switchOff();
      }
    });

  }

}
