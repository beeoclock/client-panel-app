import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {CreateAbsenceApiAdapter} from "@absence/external/adapter/api/create.order.api.adapter";
import {UpdateAbsenceApiAdapter} from "@absence/external/adapter/api/update.order.api.adapter";
import {DetailsAbsenceApiAdapter} from "@absence/external/adapter/api/details.order.api.adapter";
import {PagedAbsenceApiAdapter} from "@absence/external/adapter/api/paged.order.api.adapter";
import {DeleteAbsenceApiAdapter} from "@absence/external/adapter/api/delete.order.api.adapter";
import {ArchiveAbsenceApiAdapter} from "@absence/external/adapter/api/archive.absence.api.adapter";
import {UnarchiveAbsenceApiAdapter} from "@absence/external/adapter/api/unarchive.absence.api.adapter";

export type IAbsenceState = IBaseState<IAbsenceDto>;

const defaults = baseDefaults<IAbsenceDto>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: 20
});

@State<IAbsenceState>({
	name: 'absence',
	defaults,
})
@Injectable()
export class AbsenceState extends BaseState<IAbsenceDto> {

	protected override readonly create = inject(CreateAbsenceApiAdapter);
	protected override readonly update = inject(UpdateAbsenceApiAdapter);
	protected override readonly item = inject(DetailsAbsenceApiAdapter);
	protected override readonly delete = inject(DeleteAbsenceApiAdapter);
	protected override readonly paged = inject(PagedAbsenceApiAdapter);
	protected override readonly archive = inject(ArchiveAbsenceApiAdapter);
	protected override readonly unarchive = inject(UnarchiveAbsenceApiAdapter);

	private readonly translateService = inject(TranslateService);

	constructor() {
		super(
			defaults,
		);
	}

	// Application layer

	@Action(AbsenceActions.CloseDetails)
	public async closeDetailsAction(ctx: StateContext<IAbsenceState>, action?: AbsenceActions.CloseDetails) {

		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		await this.whacAMaleProvider.destroyComponent(AbsenceDetailsContainerComponent);

	}

	@Action(AbsenceActions.CloseForm)
	public async closeFormAction(ctx: StateContext<IAbsenceState>, action?: AbsenceActions.CloseForm) {

		const {AbsenceFormContainerComponent} = await import("@absence/presentation/component/form/absence-form-container.component");

		await this.whacAMaleProvider.destroyComponent(AbsenceFormContainerComponent);

	}

	@Action(AbsenceActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IAbsenceState>, {payload}: AbsenceActions.UpdateOpenedDetails) {

		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
			component: AbsenceDetailsContainerComponent,
			componentInputs: {item: payload},
		});

	}

	@Action(AbsenceActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IAbsenceState>, {payload}: AbsenceActions.OpenDetails) {

		const title = await this.translateService.instant('absence.details.title');

		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: AbsenceDetailsContainerComponent,
			componentInputs: {
				item: payload
			},
		});

	}

	@Action(AbsenceActions.OpenDetailsById)
	public async openDetailsByIdAction(ctx: StateContext<IAbsenceState>, {payload: id}: AbsenceActions.OpenDetailsById) {

		const title = await this.translateService.instant('absence.details.title');

		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			showLoading: true,
			component: AbsenceDetailsContainerComponent,
		});

		const item = await this.item.executeAsync(id);

		await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
			component: AbsenceDetailsContainerComponent,
			componentInputs: {item},
		});

	}

	@Action(AbsenceActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IAbsenceState>, action: AbsenceActions.OpenFormToEditById) {

		const title = await this.translateService.instant('absence.form.title.edit');

		const {AbsenceFormContainerComponent} = await import("@absence/presentation/component/form/absence-form-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: AbsenceFormContainerComponent,
			componentInputs: {},
		});

		const item = await this.item.executeAsync(action.payload);

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: AbsenceFormContainerComponent,
			componentInputs: {
				item,
				isEditMode: true,
			},
		});

	}

	@Action(AbsenceActions.OpenForm)
	public async openFormAction(ctx: StateContext<IAbsenceState>, {payload}: AbsenceActions.OpenForm): Promise<void> {

		const {AbsenceFormContainerComponent} = await import("@absence/presentation/component/form/absence-form-container.component");

		const {componentInputs, pushBoxInputs} = payload ?? {};

		await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('absence.form.title.create'),
			...(pushBoxInputs ?? {}),
			component: AbsenceFormContainerComponent,
			componentInputs,
		});

	}

	// API

	@Action(AbsenceActions.Init)
	public override async init(ctx: StateContext<IAbsenceState>): Promise<void> {
		await super.init(ctx);
	}

	@Action(AbsenceActions.UpdateFilters)
	public override updateFilters(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateFilters) {
		super.updateFilters(ctx, action);
	}

	@Action(AbsenceActions.UpdateTableState)
	public override updateTableState(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateTableState) {
		super.updateTableState(ctx, action);
	}

	@Action(AbsenceActions.CreateItem)
	public override async createItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.CreateItem) {
		await super.createItem(ctx, action);
		await this.closeFormAction(ctx);
	}

	@Action(AbsenceActions.ArchiveItem)
	public override async archiveItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.ArchiveItem) {
		await super.archiveItem(ctx, action);
	}

	@Action(AbsenceActions.UnarchiveItem)
	public override async unarchiveItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UnarchiveItem) {
		await super.unarchiveItem(ctx, action);
	}

	@Action(AbsenceActions.UpdateItem)
	public override async updateItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);

		// TODO: fix problem with ID, need to find way for use generate and use a new if of whac-a-mole or create
		// TODO: some new interface e.g. OnInit but for whac-a-mole to control form/modal/whac-a-mole

		// TODO: we can't use default component.name but we can create custom component name!!!

		await this.closeFormAction(ctx, {
			payload: action.payload._id
		});
		const {data} = ctx.getState().item;
		data && await this.updateOpenedDetailsAction(ctx, {payload: data});
	}

	@Action(AbsenceActions.GetItem)
	public override async getItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.GetItem): Promise<void> {
		await super.getItem(ctx, action);
	}

	@Action(AbsenceActions.DeleteItem)
	public override async deleteItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.DeleteItem) {
		await super.deleteItem(ctx, action);
		await this.closeDetailsAction(ctx, action);
	}

	@Action(AbsenceActions.GetList)
	public override async getList(ctx: StateContext<IAbsenceState>, action: AbsenceActions.GetList): Promise<void> {
		await super.getList(ctx, action);
	}

	// Selectors

	@Selector()
	public static itemData(state: IAbsenceState) {
		return state.item.data;
	}

	@Selector()
	public static tableStateItems(state: IAbsenceState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IAbsenceState) {
		const {tableState} = state;
		return tableState;
	}

	@Selector()
	public static tableStateFilters(state: IAbsenceState) {
		return state.tableState.filters;
	}

}
