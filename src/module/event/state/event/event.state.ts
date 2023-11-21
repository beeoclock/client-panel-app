import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Event from "@event/domain";
import {MEvent} from "@event/domain";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {EventActions} from "@event/state/event/event.actions";
import {ArchiveEventApiAdapter} from "@event/adapter/external/api/archive.event.api.adapter";
import {CreateEventApiAdapter} from "@event/adapter/external/api/create.event.api.adapter";
import {UpdateEventApiAdapter} from "@event/adapter/external/api/update.event.api.adapter";
import {ItemEventApiAdapter} from "@event/adapter/external/api/item.event.api.adapter";
import {RemoveEventApiAdapter} from "@event/adapter/external/api/remove.event.api.adapter";
import {DoneStatusEventApiAdapter} from "@event/adapter/external/api/done.status.event.api.adapter";
import {RequestedStatusEventApiAdapter} from "@event/adapter/external/api/requested.status.event.api.adapter";
import {CancelledStatusEventApiAdapter} from "@event/adapter/external/api/cancelled.status.event.api.adapter";
import {BookedStatusEventApiAdapter} from "@event/adapter/external/api/booked.status.event.api.adapter";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {ListMergedEventApiAdapter} from "@event/adapter/external/api/list.merged.event.api.adapter";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";

export type IEventState = IBaseState<Event.IEvent>;

@State<IEventState>({
	name: 'event',
	defaults: baseDefaults<Event.IEvent>({
		status: EventStatusEnum.booked,
	})
})
@Injectable()
export class EventState extends BaseState<Event.IEvent> {

	protected override readonly archive = inject(ArchiveEventApiAdapter);
	protected override readonly create = inject(CreateEventApiAdapter);
	protected override readonly update = inject(UpdateEventApiAdapter);
	protected override readonly item = inject(ItemEventApiAdapter);
	protected override readonly remove = inject(RemoveEventApiAdapter);
	protected override readonly list = inject(ListMergedEventApiAdapter);

	// Change status
	protected readonly doneStatusEventApiAdapter = inject(DoneStatusEventApiAdapter);
	protected readonly requestedStatusEventApiAdapter = inject(RequestedStatusEventApiAdapter);
	protected readonly cancelledStatusEventApiAdapter = inject(CancelledStatusEventApiAdapter);
	protected readonly bookedStatusEventApiAdapter = inject(BookedStatusEventApiAdapter);

	constructor() {
		super(
			// {
			// 	tableStates: 'event.cache.tableStates',
			// 	items: 'event.cache.items'
			// }
		);
	}

	@Action(EventActions.Init)
	public override async init(ctx: StateContext<IEventState>): Promise<void> {
		await super.init(ctx);
	}

	@Action(EventActions.UpdateFilters)
	public override updateFilters(ctx: StateContext<IEventState>, action: EventActions.UpdateFilters) {
		super.updateFilters(ctx, action);
	}

	@Action(EventActions.UpdateTableState)
	public override updateTableState(ctx: StateContext<IEventState>, action: EventActions.UpdateTableState) {
		super.updateTableState(ctx, action);
	}

	@Action(EventActions.GetItem)
	public override async getItemFromCacheOrApi(ctx: StateContext<IEventState>, action: EventActions.GetItem): Promise<void> {
		await super.getItemFromCacheOrApi(ctx, action);
	}

	@Action(EventActions.DeleteItem)
	public override async deleteItem(ctx: StateContext<IEventState>, action: EventActions.DeleteItem) {
		await super.deleteItem(ctx, action);
	}

	@Action(EventActions.CreateItem)
	public override async createItem(ctx: StateContext<IEventState>, action: EventActions.CreateItem): Promise<void> {
		await super.createItem(ctx, action);
	}

	@Action(EventActions.UpdateItem)
	public override async updateItem(ctx: StateContext<IEventState>, action: EventActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
	}

	@Action(EventActions.GetList)
	public override async getList(ctx: StateContext<IEventState>, action: EventActions.GetList): Promise<void> {
		await super.getList(ctx, action);

	}

	// Statuses


	@Action(EventActions.DoneStatus)
	public async doneStatus(ctx: StateContext<IEventState>, {payload}: EventActions.DoneStatus): Promise<void> {
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));
		await this.doneStatusEventApiAdapter.executeAsync(payload._id);

		// await firstValueFrom(ctx.dispatch(new EventActions.ClearTableCache()));
		// await firstValueFrom(ctx.dispatch(new EventActions.ClearItemCache()));

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));
	}

	@Action(EventActions.CancelledStatus)
	public async cancelledStatus(ctx: StateContext<IEventState>, {payload}: EventActions.CancelledStatus): Promise<void> {
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));
		await this.cancelledStatusEventApiAdapter.executeAsync(payload._id);

		// await firstValueFrom(ctx.dispatch(new EventActions.ClearTableCache()));
		// await firstValueFrom(ctx.dispatch(new EventActions.ClearItemCache()));

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));
	}

	// Selectors

	@Selector()
	public static itemData(state: IEventState) {
		return MEvent.create(state.item.data);
	}

	@Selector()
	public static tableStateItems(state: IEventState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IEventState) {
		return state.tableState;
	}

}
