import {Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {CacheActions} from "@utility/state/cache/cache.actions";

export interface ICacheState {
  pageLoading: boolean;
}

@State<ICacheState>({
  name: 'cache',
  defaults: undefined
})
@Injectable()
export class CacheState {

  @Action(CacheActions.Set)
  public async set(
    ctx: StateContext<ICacheState>,
    {payload}: CacheActions.Set
  ): Promise<boolean> {
    payload.strategy.setItem(payload.key, payload.value);
    return true;
  }

  // @Action(CacheActions.Get)
  // public async get(
  //   ctx: StateContext<ICacheState>,
  //   {payload}: CacheActions.Get
  // ): Promise<string | null> {
  //   return payload.strategy.getItem(payload.key);
  // }

  @Action(CacheActions.Remove)
  public async remove(
    ctx: StateContext<ICacheState>,
    {payload}: CacheActions.Remove
  ): Promise<boolean> {
    payload.strategy.removeItem(payload.key)
    return true;
  }

}
