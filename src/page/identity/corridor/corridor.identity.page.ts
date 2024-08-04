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
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {LogoutComponent} from "@utility/presentation/component/logout/logout.component";
import {BooleanState} from "@utility/domain";
import {AppActions} from "@utility/state/app/app.actions";
import {Reactive} from "@utility/cdk/reactive";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {TENANT_ID} from "@src/token";
import {AnalyticsService} from "@utility/cdk/analytics.service";

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

	readonly #analyticsService = inject(AnalyticsService);

    @Select(IdentityState.clients)
    private readonly clients$!: Observable<IMember[]>;

    public readonly tenantId$ = inject(TENANT_ID);

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

    public ngOnInit(): void {

		this.#analyticsService.logEvent('corridor_identity_page_initialized');

        this.store.dispatch(new IdentityActions.GetClients());

        this.tenantId$.pipe(
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

    public get pathToMainAuthorizedPageWithTenantId() {
        return ['/', this.tenantId$.value ?? '', 'event', 'calendar-with-specialists'];
    }

    public async gotToMainAuthorizedPage(): Promise<boolean> {
        return this.router.navigate(this.pathToMainAuthorizedPageWithTenantId);
    }

    public async select(member: IMember): Promise<void> {
        this.disabled.switchOn();

        this.store.dispatch(new AppActions.PageLoading(true)).pipe(
            tap(() => {
                this.tenantId$.next(member.client._id);
            }),
            switchMap(() => this.tenantId$),
            filter((tenantId) => tenantId === member.client._id),
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
