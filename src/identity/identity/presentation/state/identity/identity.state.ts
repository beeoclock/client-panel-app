import {inject, Injectable} from "@angular/core";
import {Action, NgxsOnInit, Selector, State, StateContext} from "@ngxs/store";
import {IdentityActions} from "@identity/identity/presentation/state/identity/identity.actions";
import {Auth, IdTokenResult, Unsubscribe} from "@angular/fire/auth";
import {ParsedToken} from "@firebase/auth";
import {firstValueFrom} from "rxjs";
import {IMember} from "@identity/identity/domain/interface/i.member";
import {MemberContextApiAdapter} from "@identity/identity/infrastructure/api/member-context.api.adapter";
import {setTimeoutTakeUntil$, setTimeoutTakeUntil$Type} from "@shared/domain/timer";
import {NGXLogger} from "ngx-logger";
import {secondsTo_hh_mm_ss, TWENTY_SECONDS} from "@shared/domain/time";

export interface BeeoclockParsedToken extends ParsedToken {
	clientId?: string;
	accountId?: string;
	userId?: string;

	phone_number?: string;
	name?: string;
	email?: string;
	email_verified?: boolean;
	role?: string[];
}

export interface BeeoclockIdTokenResult extends IdTokenResult {
	claims: BeeoclockParsedToken
}

interface IIdentityState {
	token: BeeoclockIdTokenResult | undefined;
	clients: IMember[] | undefined;
	refreshTokenInProgress: boolean;

	checkTokenExpirationInSeconds: number;
	tokenExpirationInSeconds?: number;
}

@State<IIdentityState>({
	name: 'identity',
	defaults: {
		token: undefined,
		refreshTokenInProgress: false,
		tokenExpirationInSeconds: undefined,
		clients: undefined,
		checkTokenExpirationInSeconds: TWENTY_SECONDS,
	}
})
@Injectable()
export class IdentityState implements NgxsOnInit {

	private readonly auth = inject(Auth);
	private readonly logger = inject(NGXLogger);
	public readonly memberContextApiAdapter = inject(MemberContextApiAdapter);
	private refreshTokenInterval: setTimeoutTakeUntil$Type | undefined;

	public ngxsOnInit(ctx: StateContext<IIdentityState>) {
		this.initToken(ctx).then();
	}

	// Selectors

	@Selector()
	public static refreshTokenInProgress(state: IIdentityState) {
		return state.refreshTokenInProgress;
	}

	@Selector()
	public static accountEmailIsVerified(state: IIdentityState) {
		return state.token?.claims?.email_verified;
	}

	@Selector()
	public static accountEmail(state: IIdentityState) {
		return state.token?.claims?.email;
	}

	@Selector()
	public static accountName(state: IIdentityState) {
		return state.token?.claims?.name;
	}

	@Selector()
	public static accountRole(state: IIdentityState) {
		return state.token?.claims?.role;
	}

	@Selector()
	public static accountPhoneNumber(state: IIdentityState) {
		return state.token?.claims?.phone_number;
	}

	@Selector()
	public static token(state: IIdentityState) {
		return state.token;
	}

	@Selector()
	public static accountId(state: IIdentityState) {
		return state.token?.claims?.accountId;
	}

	@Selector()
	public static userId(state: IIdentityState) {
		return state.token?.claims?.userId;
	}

	@Selector()
	public static accountDetails(state: IIdentityState) {
		const {token} = state;
		if (!token) {
			return {};
		}
		const {claims} = token;
		return {
			email: claims.email,
			id: claims.accountId,
			name: claims.name,
			userId: claims.userId,
		}
	}

	@Selector()
	public static clients(state: IIdentityState) {
		return state.clients;
	}

	// Effects

	@Action(IdentityActions.Token)
	public async token(ctx: StateContext<IIdentityState>, {payload}: IdentityActions.Token): Promise<void> {
		ctx.patchState({
			token: payload
		});
	}

	@Action(IdentityActions.InitToken)
	public async initToken(ctx: StateContext<IIdentityState>): Promise<void> {

		// Check if user is not authorized!
		if (!this.auth.currentUser) {

			let unsubscribeAuthState: Unsubscribe | undefined = undefined;
			const awaitOfAuthState = new Promise((resolve) => {
				unsubscribeAuthState = this.auth.onAuthStateChanged((result) => {
					if (result) {
						resolve(result)
					}
				});
			});

			await awaitOfAuthState;
			if (unsubscribeAuthState) {
				(unsubscribeAuthState as Unsubscribe)();
			}
		}

		if (this.auth.currentUser) {

			// Get token
			const token = await this.auth.currentUser.getIdTokenResult(true)
				.catch((error) => {
					this.logger.error('initToken', error);
					return undefined;
				});

			// If token is undefined, clear token
			if (!token) {
				ctx.dispatch(new IdentityActions.ClearToken());
				return;
			}

			// update state
			ctx.patchState({
				token,
			});

			// Init auto refresh token
			this.resetRefreshTokenTimeout(ctx, +(token.claims.exp ?? '0'));

		}
	}

	@Action(IdentityActions.ClearToken)
	public async clearToken(ctx: StateContext<IIdentityState>): Promise<void> {
		// update state
		ctx.patchState({
			token: undefined
		});
	}

	@Action(IdentityActions.GetClients)
	public async getClients(ctx: StateContext<IIdentityState>): Promise<void> {
		const result = await firstValueFrom(this.memberContextApiAdapter.related$());
		ctx.patchState({
			clients: result.items
		})

	}

	@Action(IdentityActions.RefreshTokenExecute)
	public async refreshTokenExecute(
		ctx: StateContext<IIdentityState>,
	) {
		this.patchRefreshTokenInProgress(ctx, true);
		await this.initToken(ctx);
		this.patchRefreshTokenInProgress(ctx, false);
	}

	private resetRefreshTokenTimeout(
		ctx: StateContext<IIdentityState>,
		exp: number,
	): void {
		const {checkTokenExpirationInSeconds} = ctx.getState();
		this.refreshTokenInterval?.destroyTimeout$?.next();
		const timerMs = ((exp * 1000) - Date.now()) - (checkTokenExpirationInSeconds * 1000);
		this.logger.debug('resetRefreshTokenTimeout', secondsTo_hh_mm_ss(timerMs / 1000));
		this.refreshTokenInterval = setTimeoutTakeUntil$(() => {
			ctx.dispatch(new IdentityActions.RefreshTokenExecute());
		}, timerMs);
	}

	private patchRefreshTokenInProgress(
		ctx: StateContext<IIdentityState>,
		refreshTokenInProgress: boolean
	): void {
		ctx.patchState({
			refreshTokenInProgress
		});
	}

}
