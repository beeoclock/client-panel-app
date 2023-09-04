import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Client from "@client/domain";
import {ClientActions} from "@client/state/client/client.actions";
import {ItemClientApiAdapter} from "@client/adapter/external/api/item.client.api.adapter";
import {AppActions} from "@utility/state/app/app.actions";

interface IClientState {
	item: Client.IClient | undefined;
}

@State<IClientState>({
	name: 'client',
	defaults: {
		item: undefined
	}
})
@Injectable()
export class ClientState {

	@Selector()
	public static item(state: IClientState): Client.IClient | undefined {
		return state.item;
	}

	public readonly itemClientApiAdapter = inject(ItemClientApiAdapter);

	@Action(ClientActions.GetItem)
	public async getItem(ctx: StateContext<IClientState>): Promise<void> {

		ctx.dispatch(new AppActions.PageLoading(true));

		const item = await this.itemClientApiAdapter.executeAsync();
		ctx.patchState({
			item
		})

		ctx.dispatch(new AppActions.PageLoading(false));

	}


}
