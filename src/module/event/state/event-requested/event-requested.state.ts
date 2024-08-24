import {Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Event from "@event/domain";
import {MEvent} from "@event/domain";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";
import {EventRequestedActions} from "./event-requested.actions";
import {EventBusTokenEnum} from "@src/event-bus-token.enum";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {DurationVersionTypeEnum} from "@service/domain/enum/duration-version-type.enum";

export type IEventRequestedState = IBaseState<Event.RIEvent>;

const defaults = baseDefaults<Event.RIEvent>({
	filters: {
		status: EventStatusEnum.requested,
	},
	orderDir: OrderDirEnum.ASC,
	orderBy: OrderByEnum.START,
	pageSize: 20
});

@State<IEventRequestedState>({
	name: 'eventRequested',
	defaults
})
@Injectable()
export class EventRequestedState extends BaseState<Event.RIEvent> {

	// protected override readonly update = inject(UpdateEventApiAdapter);
	// protected override readonly paged = inject(ListEventApiAdapter);

	// Change status
	// protected readonly rejectedStatusEventApiAdapter = inject(RejectedStatusEventApiAdapter);
	// protected readonly bookedStatusEventApiAdapter = inject(BookedStatusEventApiAdapter);

	constructor() {
		super(
			defaults
		);
	}

	@Action(EventRequestedActions.Init)
	public override async init(ctx: StateContext<IEventRequestedState>): Promise<void> {
		await super.init(ctx);
	}


	@Action(EventRequestedActions.UpdateFilters)
	public override updateFilters(ctx: StateContext<IEventRequestedState>, action: EventRequestedActions.UpdateFilters) {
		super.updateFilters(ctx, action);
	}

	@Action(EventRequestedActions.UpdateTableState)
	public override updateTableState(ctx: StateContext<IEventRequestedState>, action: EventRequestedActions.UpdateTableState) {
		super.updateTableState(ctx, action);
	}

	@Action(EventRequestedActions.GetList)
	public override async getList(ctx: StateContext<IEventRequestedState>, action: EventRequestedActions.GetList): Promise<void> {
		await super.getList(ctx, action);
		const {tableState} = ctx.getState();
		this.ngEventBus.cast(EventBusTokenEnum.SIDE_BAR_EVENT_REQUESTED_BADGE, tableState.total);
	}

	// Statuses

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

	// Selectors

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

}
