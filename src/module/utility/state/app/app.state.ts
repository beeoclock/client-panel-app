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
  public async UpdateFilters(ctx: StateContext<IAppState>, {payload}: AppActions.PageLoading): Promise<void> {

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
