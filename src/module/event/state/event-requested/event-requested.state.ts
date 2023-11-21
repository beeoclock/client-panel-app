import {inject, Injectable} from "@angular/core";
import {Action, NgxsOnInit, Selector, State, StateContext} from "@ngxs/store";
import * as Event from "@event/domain";
import {MEvent} from "@event/domain";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {ArchiveEventApiAdapter} from "@event/adapter/external/api/archive.event.api.adapter";
import {CreateEventApiAdapter} from "@event/adapter/external/api/create.event.api.adapter";
import {UpdateEventApiAdapter} from "@event/adapter/external/api/update.event.api.adapter";
import {ItemEventApiAdapter} from "@event/adapter/external/api/item.event.api.adapter";
import {RemoveEventApiAdapter} from "@event/adapter/external/api/remove.event.api.adapter";
import {BookedStatusEventApiAdapter} from "@event/adapter/external/api/booked.status.event.api.adapter";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";
import {RejectedStatusEventApiAdapter} from "@event/adapter/external/api/rejected.status.event.api.adapter";
import {EventRequestedActions} from "./event-requested.actions";
import {ListEventApiAdapter} from "../../adapter/external/api/list.event.api.adapter";
import {EventBusTokenEnum} from "@src/event-bus-token.enum";

export type IEventRequestedState = IBaseState<Event.IEvent>;

@State<IEventRequestedState>({
	name: 'eventRequested',
	defaults: baseDefaults<Event.IEvent>({
		status: EventStatusEnum.requested,
	})
})
@Injectable()
export class EventRequestedState extends BaseState<Event.IEvent> implements NgxsOnInit {

	protected override readonly archive = inject(ArchiveEventApiAdapter);
	protected override readonly create = inject(CreateEventApiAdapter);
	protected override readonly update = inject(UpdateEventApiAdapter);
	protected override readonly item = inject(ItemEventApiAdapter);
	protected override readonly remove = inject(RemoveEventApiAdapter);
	protected override readonly list = inject(ListEventApiAdapter);

	// Change status
	protected readonly rejectedStatusEventApiAdapter = inject(RejectedStatusEventApiAdapter);
	protected readonly bookedStatusEventApiAdapter = inject(BookedStatusEventApiAdapter);

	constructor() {
		super(
			// {
			// 	tableStates: 'event.requested.cache.tableStates',
			// 	items: 'event.requested.cache.items'
			// }
		);
	}

	public ngxsOnInit(ctx: StateContext<IEventRequestedState>) {
		ctx.dispatch(new EventRequestedActions.GetList());
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

	@Action(EventRequestedActions.GetItem)
	public override async getItemFromCacheOrApi(ctx: StateContext<IEventRequestedState>, action: EventRequestedActions.GetItem): Promise<void> {
		await super.getItemFromCacheOrApi(ctx, action);
	}

	@Action(EventRequestedActions.UpdateItem)
	public override async updateItem(ctx: StateContext<IEventRequestedState>, action: EventRequestedActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
	}

	@Action(EventRequestedActions.GetList)
	public override async getList(ctx: StateContext<IEventRequestedState>, action: EventRequestedActions.GetList): Promise<void> {
		await super.getList(ctx, action);
		const {tableState} = ctx.getState();
		console.log(tableState);
		this.ngEventBus.cast(EventBusTokenEnum.SIDE_BAR_EVENT_REQUESTED_BADGE, tableState.total);
	}

	// Statuses

	@Action(EventRequestedActions.BookedStatus)
	public async bookedStatus(ctx: StateContext<IEventRequestedState>, {payload}: EventRequestedActions.BookedStatus): Promise<void> {
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));
		await this.bookedStatusEventApiAdapter.executeAsync(payload._id);

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));
	}

	@Action(EventRequestedActions.CancelledStatus)
	public async cancelledStatus(ctx: StateContext<IEventRequestedState>, {payload}: EventRequestedActions.CancelledStatus): Promise<void> {
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));
		await this.rejectedStatusEventApiAdapter.executeAsync(payload._id);

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
