import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {Auth, IdTokenResult, Unsubscribe} from "@angular/fire/auth";
import {ParsedToken} from "@firebase/auth";
import {firstValueFrom} from "rxjs";
import {IMember} from "@identity/domain/interface/i.member";
import {MemberContextApiAdapter} from "@identity/adapter/external/api/member-context.api.adapter";

export interface BeeoclockParsedToken extends ParsedToken {
  clientId?: string;
  accountId?: string;
  userId?: string;
}

export interface BeeoclockIdTokenResult extends IdTokenResult {
  claims: BeeoclockParsedToken
}

interface IIdentityState {
  token: BeeoclockIdTokenResult | undefined;
  clients: IMember[] | undefined;
}

@State<IIdentityState>({
  name: 'identity',
  defaults: {
    token: undefined,
    clients: undefined
  }
})
@Injectable()
export class IdentityState {

  private readonly auth = inject(Auth);
  public readonly memberContextApiAdapter = inject(MemberContextApiAdapter);

  // Selectors

  @Selector()
  public static token(state: IIdentityState) {
    return state.token;
  }

  @Selector()
  public static clientId(state: IIdentityState) {
    return state.token?.claims?.clientId;
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
      const token = await this.auth.currentUser.getIdTokenResult(true);

      // update state
      ctx.dispatch(new IdentityActions.Token(token));

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
    const result = await firstValueFrom(this.memberContextApiAdapter.postRelated$());
    ctx.patchState({
      clients: result.items
    })

  }

}
