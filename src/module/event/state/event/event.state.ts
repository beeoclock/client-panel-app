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
import {CancelledStatusEventApiAdapter} from "@event/adapter/external/api/cancelled.status.event.api.adapter";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {ListMergedEventApiAdapter} from "@event/adapter/external/api/list.merged.event.api.adapter";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {RefreshCalendarAction} from "@event/state/calendar/actions/refresh.calendar.action";
import {TranslateService} from "@ngx-translate/core";


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
	protected override readonly delete = inject(RemoveEventApiAdapter);
	protected override readonly paged = inject(ListMergedEventApiAdapter);

	// Change status
	protected readonly doneStatusEventApiAdapter = inject(DoneStatusEventApiAdapter);
	protected readonly cancelledStatusEventApiAdapter = inject(CancelledStatusEventApiAdapter);
	private readonly translateService = inject(TranslateService);

	constructor() {
		super(
			defaults,
		);
	}

	// Application layer

	@Action(EventActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IEventState>, {payload}: EventActions.UpdateOpenedDetails) {

		const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");

		await this.pushBoxService.updatePushBoxComponentAsync({
			component: ContainerDetailsComponent,
			componentInputs: {
				event: Event.MEvent.create(payload)
			},
		});

	}

	@Action(EventActions.CloseDetails)
	public async closeDetails(ctx: StateContext<IEventState>, action?: EventActions.CloseDetails) {

		const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");

		await this.pushBoxService.destroyComponent(ContainerDetailsComponent);

	}

	@Action(EventActions.CloseForm)
	public async closeForm(ctx: StateContext<IEventState>, action?: EventActions.CloseForm) {

		const {ContainerFormComponent} = await import("@event/presentation/component/form/container.form.component");

		await this.pushBoxService.destroyComponent(ContainerFormComponent);

	}

	@Action(EventActions.OpenDetails)
	public async openDetails(ctx: StateContext<IEventState>, {payload: item}: EventActions.OpenDetails) {

		const title = this.translateService.instant('event.details.title');

		const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");

		await this.pushBoxService.buildItAsync({
			title,
			component: ContainerDetailsComponent,
			componentInputs: {
				event: item
			},
		});

	}

	// @Action(EventActions.OpenDetailsById)
	// public async openDetailsById(ctx: StateContext<IEventState>, {payload: id}: EventActions.OpenDetailsById) {
	//
	// 	const title = this.translateService.instant('event.details.title');
	//
	// 	const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");
	//
	// 	await this.pushBoxService.buildItAsync({
	// 		component: ContainerDetailsComponent,
	// 		showLoading: true,
	// 		title
	// 	});
	//
	// 	const event = await this.item.executeAsync(id);
	//
	// 	await this.pushBoxService.updatePushBoxComponentAsync({
	// 		id,
	// 		component: ContainerDetailsComponent,
	// 		componentInputs: {
	// 			event: Event.MEvent.create(event)
	// 		},
	// 	});
	//
	// }

	@Action(EventActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IEventState>, {payload: id}: EventActions.OpenFormToEditById) {

		const title = this.translateService.instant('event.form.title.edit');

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					id,
					title,
					showLoading: true,
				}
			}
		});

		const event = await this.item.executeAsync(id);

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					id,
					title
				},
				componentInputs: {
					event
				}
			}
		});

	}

	@Action(EventActions.OpenForm)
	public async openForm(ctx: StateContext<IEventState>, {payload}: EventActions.OpenForm): Promise<void> {

		const {ContainerFormComponent} = await import("@event/presentation/component/form/container.form.component");

		const {pushBoxInputs, componentInputs} = payload ?? {};

		await this.pushBoxService.buildItAsync({
			title: this.translateService.instant('event.form.title.create'),
			...pushBoxInputs,
			component: ContainerFormComponent,
			componentInputs: {
				...componentInputs,
				forceStart: componentInputs?.datetimeISO,
				isEditMode: !!componentInputs?.event,
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
		await this.closeDetails(ctx, action);
		// Try to close details of event
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
		const {item: {data}} = ctx.getState();
		data && await this.updateOpenedDetails(ctx, {payload: data});
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
