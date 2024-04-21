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
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {RefreshCalendarAction} from "@event/state/calendar/actions/refresh.calendar.action";


export type IEventState = IBaseState<Event.IEvent>;

const defaults = baseDefaults<Event.IEvent>({
	filters: {
		status: EventStatusEnum.booked,
	},
	orderBy: OrderByEnum.START,
	orderDir: OrderDirEnum.ASC,
});

@State<IEventState>({
	name: 'event',
	defaults,
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
			defaults,
		);
	}

	// Application layer

	@Action(EventActions.CloseForm)
	public async closeForm(ctx: StateContext<IEventState>) {

		const {ContainerFormComponent} = await import("@event/presentation/component/form/container.form.component");

		this.pushBoxService.destroy$.next(ContainerFormComponent);

	}

	@Action(EventActions.CloseDetails)
	public async closeDetails(ctx: StateContext<IEventState>) {

		const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");

		this.pushBoxService.destroy$.next(ContainerDetailsComponent);

	}

	@Action(EventActions.OpenDetailsById)
	public async openDetailsById(ctx: StateContext<IEventState>, action: EventActions.OpenDetailsById) {

		const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");

		await this.pushBoxService.buildItAsync({
			component: ContainerDetailsComponent,
		});

		const event = await this.item.executeAsync(action.payload);

		await this.pushBoxService.buildItAsync({
			component: ContainerDetailsComponent,
			componentInputs: {event},
		});

	}

	@Action(EventActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IEventState>, action: EventActions.OpenFormToEditById) {

		await this.openForm(ctx, {});

		const event = await this.item.executeAsync(action.payload);

		await this.openForm(ctx, {
			payload: {
				event,
			}
		});

	}

	@Action(EventActions.OpenForm)
	public async openForm(ctx: StateContext<IEventState>, {payload}: EventActions.OpenForm): Promise<void> {

		const {ContainerFormComponent} = await import("@event/presentation/component/form/container.form.component");

		const {event, datetimeISO, callback, member} = payload ?? {};

		await this.pushBoxService.buildItAsync({
			component: ContainerFormComponent,
			componentInputs: {
				event,
				forceStart: datetimeISO,
				isEditMode: !!event,
				callback,
				member
			},
		});

	}

	// API

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
	public override async getItem(ctx: StateContext<IEventState>, action: EventActions.GetItem): Promise<void> {
		await super.getItem(ctx, action);
	}

	@Action(EventActions.DeleteItem)
	public override async deleteItem(ctx: StateContext<IEventState>, action: EventActions.DeleteItem) {
		await super.deleteItem(ctx, action);
		ctx.dispatch(new EventActions.GetList({resetPage: false, resetParams: false}));
		ctx.dispatch(new CalendarWithSpecialistsAction.GetItems());
		ctx.dispatch(new RefreshCalendarAction());
	}

	@Action(EventActions.CreateItem)
	public override async createItem(ctx: StateContext<IEventState>, action: EventActions.CreateItem): Promise<void> {
		await super.createItem(ctx, action);
		await this.closeForm(ctx);
	}

	@Action(EventActions.UpdateItem)
	public override async updateItem(ctx: StateContext<IEventState>, action: EventActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
		await this.closeForm(ctx);
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
		if (!state.item.data) {
			return null;
		}
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
