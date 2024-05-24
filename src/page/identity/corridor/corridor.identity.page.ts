import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
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
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";

@Component({
  selector: 'app-identity-corridor-page',
  templateUrl: './corridor.identity.page.html',
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
		LogoutComponent,
		BackButtonComponent,
		BackLinkComponent
	],
  encapsulation: ViewEncapsulation.None
})
export class CorridorIdentityPage extends Reactive implements OnInit {

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly identityApiAdapter = inject(IdentityApiAdapter);

  @Select(IdentityState.clients)
  private readonly clients$!: Observable<IMember[]>;

  @Select(IdentityState.clientId)
  public readonly clientId$!: Observable<string | undefined>;

  public readonly members$ = this.clients$.pipe(
    filter(Array.isArray),
    tap((result) => {
      if (!('force' in this.activatedRoute.snapshot.queryParams)) {
        if (result.length === 0) {
          this.gotToCreateBusinessPage({
            firstCompany: true
          }).then();
        }
      } else {
        if ('firstCompany' in this.activatedRoute.snapshot.queryParams) {
          if (result.length) {
            this.select(result[0]).then();
          }
        }
      }
      this.loader.switchOff();
    })
  );

  public readonly loader = new BooleanState(true);
  public readonly disabled = new BooleanState(false);
	public readonly pathToMainAuthorizedPage = ['/', 'event', 'calendar-with-specialists'];

  public ngOnInit(): void {

    this.store.dispatch(new IdentityActions.GetClients());

    this.clientId$.pipe(
			this.takeUntil(),
      filter((result) => !!result),
      filter(() => !('force' in this.activatedRoute.snapshot.queryParams)),
      switchMap(() => from(this.gotToMainAuthorizedPage()))
    ).subscribe();

  }

  public async gotToCreateBusinessPage(queryParams = {}): Promise<boolean> {
    return this.router.navigate(['/', 'identity', 'create-business'], {
      queryParams
    });
  }

  public async gotToMainAuthorizedPage(): Promise<boolean> {
    return this.router.navigate(this.pathToMainAuthorizedPage);
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
      switchMap(() => from(this.gotToMainAuthorizedPage())),
      this.takeUntil(),
    ).subscribe({
      error: () => {
        this.disabled.switchOff();
      }
    });

  }

}

export default CorridorIdentityPage;
