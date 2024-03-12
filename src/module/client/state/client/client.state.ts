import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Client from "@client/domain";
import {ClientActions} from "@client/state/client/client.actions";
import {AppActions} from "@utility/state/app/app.actions";
import {
	ItemBusinessProfileApiAdapter
} from "@client/adapter/external/api/buisness-profile/item.business-profile.api.adapter";
import {RISchedule} from "@utility/domain/interface/i.schedule";

interface IClientState {
	item: Client.RIClient | undefined;
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
	public static item(state: IClientState): Client.RIClient | undefined {
		return state.item;
	}

	@Selector()
	public static earliestScheduleAndLatestSchedule(state: IClientState): {
		earliestSchedule: RISchedule,
		latestSchedule: RISchedule,
	} | null {

		if (!state.item) {
			return null;
		}

		const item = state.item;

		// Find earliest schedule and latest schedule
		const {earliestSchedule, latestSchedule} = item.schedules
			.reduce(({earliestSchedule, latestSchedule}, schedule) => {
				return {
					earliestSchedule: earliestSchedule.startInSeconds < schedule.startInSeconds ? earliestSchedule : schedule,
					latestSchedule: latestSchedule.endInSeconds > schedule.endInSeconds ? latestSchedule : schedule
				};
			}, {earliestSchedule: item.schedules[0], latestSchedule: item.schedules[0]});

		return {
			earliestSchedule,
			latestSchedule
		};

	}

	public readonly itemBusinessProfileApiAdapter = inject(ItemBusinessProfileApiAdapter);

	@Action(ClientActions.InitClient)
	public async getItem(ctx: StateContext<IClientState>): Promise<void> {

		ctx.dispatch(new AppActions.PageLoading(true));

		const item = await this.itemBusinessProfileApiAdapter.executeAsync();
		ctx.patchState({
			item
		})

		ctx.dispatch(new AppActions.PageLoading(false));

	}


}
