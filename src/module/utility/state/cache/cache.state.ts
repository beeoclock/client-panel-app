import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {CacheActions} from "@utility/state/cache/cache.actions";
import {NgxIndexedDBService} from "ngx-indexed-db";
import {firstValueFrom} from "rxjs";
import {NGXLogger} from "ngx-logger";

export interface ICacheState<ITEM_TYPE = unknown> {
  [key: string]: ITEM_TYPE;
}

@State<ICacheState>({
  name: 'cache',
  defaults: undefined
})
@Injectable()
export class CacheState {

  private readonly ngxIndexedDBService = inject(NgxIndexedDBService);
  private readonly logger = inject(NGXLogger);

  @Action(CacheActions.Init)
  public async init(
    ctx: StateContext<ICacheState>,
  ): Promise<void> {
    ctx.setState({});
  }

  @Action(CacheActions.Set)
  public async set(
    ctx: StateContext<ICacheState>,
    {payload}: CacheActions.Set
  ): Promise<boolean> {
    if (payload.strategy === 'indexedDB') {

      try {
        await firstValueFrom(this.ngxIndexedDBService.update('cache', {
          key: payload.key,
          value: payload.value,
        }));

        ctx.patchState({
          [payload.key]: JSON.parse(payload.value)
        });
      } catch (e) {
        this.logger.error(e);
      }

    } else {
      payload.strategy.setItem(payload.key, payload.value);
    }
    return true;
  }

  @Action(CacheActions.Get)
  public async get(
    ctx: StateContext<ICacheState>,
    {payload}: CacheActions.Get
  ): Promise<void> {
    let result = undefined;
    if (payload.strategy === 'indexedDB') {
      const data: { key: string; value: string; } | null = await firstValueFrom(this.ngxIndexedDBService.getByKey('cache', payload.key));
      if (data) {
        result = data.value;
      }
    } else {
      result = payload.strategy.getItem(payload.key);
    }
    if (result) {
      ctx.patchState({
        [payload.key]: JSON.parse(result)
      });
    }
  }

  @Action(CacheActions.Remove)
  public async remove(
    ctx: StateContext<ICacheState>,
    {payload}: CacheActions.Remove
  ): Promise<boolean> {
    if (payload.strategy === 'indexedDB') {

      try {

        await firstValueFrom(this.ngxIndexedDBService.delete('cache', payload.key));
        ctx.patchState({
          [payload.key]: []
        });
      } catch (e) {
				this.logger.error(e);
      }

    } else {
      payload.strategy.removeItem(payload.key)
    }
    return true;
  }

}
