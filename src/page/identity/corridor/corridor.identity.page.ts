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
import {LAST_OPENED_TENANT_ID_MAP_BY_LOGIN, TENANT_ID} from "@src/token";
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

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

	public readonly tenantId$ = inject(TENANT_ID);
	public backPath: string[] = [];
	public lastOpenedPath: string[] = [];
	public readonly loader = new BooleanState(true);
	public readonly disabled = new BooleanState(false);
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly lastOpenedTenantIdMapByLogin$ = inject(LAST_OPENED_TENANT_ID_MAP_BY_LOGIN);
	readonly #analyticsService = inject(AnalyticsService);
	@Select(IdentityState.clients)
	private readonly clients$!: Observable<IMember[]>;
	public readonly members$ = this.clients$.pipe(
		filter(Array.isArray),
		tap((result) => {

			const force = 'force' in this.activatedRoute.snapshot.queryParams;
			const firstCompany = 'firstCompany' in this.activatedRoute.snapshot.queryParams;
			const haveCompany = result.length > 0;
			const needCreateCompany = !force && !haveCompany;
			const selectFirstCompany = force && firstCompany && haveCompany;

			if (needCreateCompany) {
				this.gotToCreateBusinessPage({
					firstCompany: true
				}).then();
				return;
			}

			if (selectFirstCompany) {
				this.select(result[0]).then();
			}

			this.loader.switchOff();

		})
	);
	@SelectSnapshot(IdentityState.accountEmail)
	private readonly accountEmail!: string;

	public ngOnInit(): void {

		this.#analyticsService.logEvent('corridor_identity_page_initialized');

		this.store.dispatch(new IdentityActions.GetClients());

		this.lastOpenedTenantIdMapByLogin$.pipe(
			this.takeUntil(),
			tap(() => {
				this.buildBackPath();
			}),
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

	public getPathToBack(): string[] {
		const tenantId = this.tenantId$.value;
		if (tenantId) {
			return ['/', tenantId, 'event', 'calendar-with-specialists'];
		}
		return [];
	}

	public getPathToMainAuthorizedPageWithTenantId(): string[] {
		const lastOpenedTenantIdMapByLogin = this.lastOpenedTenantIdMapByLogin$.value;
		if (lastOpenedTenantIdMapByLogin) {
			const lastOpenedTenantId = lastOpenedTenantIdMapByLogin.get(this.accountEmail);
			if (lastOpenedTenantId) {
				return ['/', lastOpenedTenantId, 'event', 'calendar-with-specialists'];
			}
		}
		return [];
	}

	public async gotToMainAuthorizedPage(): Promise<boolean> {
		return this.router.navigate(this.lastOpenedPath);
	}

	public async select(member: IMember): Promise<void> {
		this.disabled.switchOn();

		this.store.dispatch(new AppActions.PageLoading(true)).pipe(
			tap(() => {
				const tenantId = member.client._id;
				this.setLastOpenedTenantIdMapByLogin(tenantId);
				this.tenantId$.next(tenantId);
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

	private buildBackPath(): void {
		this.backPath = this.getPathToBack();
		this.lastOpenedPath = this.getPathToMainAuthorizedPageWithTenantId();
	}

	@Dispatch()
	private setLastOpenedTenantIdMapByLogin(tenantId: string) {
		return new AppActions.SetLastOpenedTenantIdMapByLogin(this.accountEmail, tenantId);
	}

}

export default CorridorIdentityPage;
