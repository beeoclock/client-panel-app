import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {AppActions} from "@shared/state/app/app.actions";
import {LAST_OPENED_TENANT_ID_MAP_BY_LOGIN} from "@src/token";

export interface IAppState {
	pageLoading: boolean;
}

@State<IAppState>({
	name: 'app',
	defaults: {
		pageLoading: false,
	}
})
@Injectable()
export class AppState {

	private readonly lastOpenedTenantIdMapByLogin$ = inject(LAST_OPENED_TENANT_ID_MAP_BY_LOGIN)

	@Action(AppActions.PageLoading)
	public pageLoading(ctx: StateContext<IAppState>, {payload}: AppActions.PageLoading) {

		ctx.patchState({
			pageLoading: payload
		});

	}

	@Action(AppActions.SetLastOpenedTenantIdMapByLogin)
	public setLastOpenedTenantIdMapByLogin(ctx: StateContext<IAppState>, {
		accountEmail,
		tenantId
	}: AppActions.SetLastOpenedTenantIdMapByLogin) {
		const lastOpenedTenantIdMapByLogin = this.lastOpenedTenantIdMapByLogin$.value;
		lastOpenedTenantIdMapByLogin.set(accountEmail, tenantId);
		localStorage.setItem('lastOpenedTenantIdMapByLogin', JSON.stringify(Array.from(lastOpenedTenantIdMapByLogin.entries())));
		this.lastOpenedTenantIdMapByLogin$.next(lastOpenedTenantIdMapByLogin);
	}

	// Selectors
	@Selector()
	public static pageLoading(state: IAppState) {
		return state.pageLoading;
	}

}
