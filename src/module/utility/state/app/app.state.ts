import {Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {AppActions} from "@utility/state/app/app.actions";

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

  @Action(AppActions.PageLoading)
  public pageLoading(ctx: StateContext<IAppState>, {payload}: AppActions.PageLoading) {

    ctx.patchState({
      pageLoading: payload
    });

  }

  // Selectors
  @Selector()
  public static pageLoading(state: IAppState) {
    return state.pageLoading;
  }

}
