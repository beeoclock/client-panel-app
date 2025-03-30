import {Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Event from "@tenant/event/domain";
import {MEvent} from "@tenant/event/domain";
import {baseDefaults, IBaseState} from "@utility/state/base/base.state";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {EventStatusEnum} from "@core/shared/enum/event-status.enum";
import {EventRequestedActions} from "./event-requested.actions";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {DurationVersionTypeEnum} from "@core/business-logic/service/enum/duration-version-type.enum";
import {environment} from "@environment/environment";

export type IEventRequestedState = IBaseState<Event.RIEvent>;

const defaults = baseDefaults<Event.RIEvent>({
	filters: {
		status: EventStatusEnum.requested,
	},
	orderDir: OrderDirEnum.ASC,
	orderBy: OrderByEnum.START,
	pageSize: environment.config.pagination.pageSize
});

@State<IEventRequestedState>({
	name: 'eventRequested',
	defaults
})
@Injectable()
export class EventRequestedState {

	@Selector()
	public static itemData(state: IEventRequestedState) {
		return MEvent.create(state.item.data);
	}

	@Selector()
	public static tableStateItems(state: IEventRequestedState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IEventRequestedState) {
		return state.tableState;
	}

	@Action(EventRequestedActions.Init)
	public async init(ctx: StateContext<IEventRequestedState>): Promise<void> {
		// await super.init(ctx);
	}

	// Statuses

	@Action(EventRequestedActions.UpdateFilters)
	public updateFilters(ctx: StateContext<IEventRequestedState>, action: EventRequestedActions.UpdateFilters) {
		// super.updateFilters(ctx, action);
	}

	@Action(EventRequestedActions.UpdateTableState)
	public updateTableState(ctx: StateContext<IEventRequestedState>, action: EventRequestedActions.UpdateTableState) {
		// super.updateTableState(ctx, action);
	}

	@Action(EventRequestedActions.GetList)
	public async getList(ctx: StateContext<IEventRequestedState>, action: EventRequestedActions.GetList): Promise<void> {
		// await super.getList(ctx, action);
		// const {tableState} = ctx.getState();
		// this.ngEventBus.cast(EventBusTokenEnum.SIDE_BAR_EVENT_REQUESTED_BADGE, tableState.total);
	}

	// Selectors

	@Action(EventRequestedActions.SetAutomaticallyDuration)
	public async setAutomaticallyDuration(ctx: StateContext<IEventRequestedState>, {payload}: EventRequestedActions.SetAutomaticallyDuration): Promise<void> {
		// Change all services in event which has more than one durationVersions, if will then select only one the longest
		const event = structuredClone(payload);
		event.services?.forEach((service) => {
			const durationVersions = service.configuration.duration?.durationVersionType;
			if (durationVersions === DurationVersionTypeEnum.RANGE) {
				const foundLongestDurationVersion = service?.durationVersions?.reduce((prev, current) => {
					return (prev.durationInSeconds > current.durationInSeconds) ? prev : current;
				});
				service.durationVersions = [foundLongestDurationVersion];
				// Change configuration.duration.durationVersionType to SINGLE
				// delete service.configuration.duration;
			}
		});

		// await this.update.executeAsync(event);
	}

	@Action(EventRequestedActions.BookedStatus)
	public async bookedStatus(ctx: StateContext<IEventRequestedState>, {payload}: EventRequestedActions.BookedStatus): Promise<void> {
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));
		// await this.bookedStatusEventApiAdapter.executeAsync(payload._id);

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));
	}

	@Action(EventRequestedActions.RejectedStatus)
	public async rejectedStatus(ctx: StateContext<IEventRequestedState>, {payload}: EventRequestedActions.RejectedStatus): Promise<void> {
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));
		// await this.rejectedStatusEventApiAdapter.executeAsync(payload._id);

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));
	}

}
