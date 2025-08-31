import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {Select, Store} from '@ngxs/store';
import {filter, from, map, Observable, switchMap, tap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {IMember} from "@identity/identity/domain/interface/i.member";
import {LoaderComponent} from "@shared/presentation/ui/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {ChangeLanguageComponent} from "@shared/presentation/ui/component/change-language/change-language.component";
import {LogoutComponent} from "@shared/presentation/ui/component/logout/logout.component";
import {BooleanState} from "@shared/domain";
import {AppActions} from "@shared/state/app/app.actions";
import {Reactive} from "@core/cdk/reactive";
import {BackLinkComponent} from "@shared/presentation/ui/component/link/back.link.component";
import {LAST_OPENED_TENANT_ID_MAP_BY_LOGIN, TENANT_ID} from "@src/token";
import {AnalyticsService} from "@core/cdk/analytics.service";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {IdentityState} from "@identity/identity/presentation/state/identity/identity.state";
import {IdentityActions} from "@identity/identity/presentation/state/identity/identity.actions";

@Component({
	selector: 'app-identity-corridor-page',
	templateUrl: './corridor.identity.page.html',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		AsyncPipe,
		LoaderComponent,
		TranslateModule,
		ChangeLanguageComponent,
		LogoutComponent,
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
	public readonly members$: Observable<IMember[]> = this.clients$.pipe(
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
			map(() => {
				const tenantId = member.client._id;
				this.setLastOpenedTenantIdMapByLogin(tenantId);
				return tenantId;
			}),
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
