import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {Auth, IdTokenResult} from "@angular/fire/auth";

interface IIdentityState {
  token: IdTokenResult | undefined;
}

@State<IIdentityState>({
  name: 'identity',
  defaults: {
    token: undefined
  }
})
@Injectable()
export class IdentityState {

  private readonly auth = inject(Auth);

  // Selectors

  @Selector()
  public static token(state: IIdentityState) {
    return state.token;
  }

  // Effects

  @Action(IdentityActions.InitToken)
  public async initToken(ctx: StateContext<IIdentityState>): Promise<void> {
    // Get data from state
    const state = ctx.getState();

    // check if store have had the token!
    if (state.token) {
      return;
    }

    // Check if user is not authorized!
    if (!this.auth.currentUser) {
      return;
    }

    // Get token
    const token = await this.auth.currentUser.getIdTokenResult(true);

    // update state
    ctx.patchState({
      token
    })
  }

  @Action(IdentityActions.ClearToken)
  public async clearToken(ctx: StateContext<IIdentityState>): Promise<void> {
    // update state
    ctx.patchState({
      token: undefined
    })
  }

}
