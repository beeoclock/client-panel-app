import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Service from "@service/domain";
import {IService} from "@service/domain";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {ArchiveServiceApiAdapter} from "@service/adapter/external/api/archive.service.api.adapter";
import {CreateServiceApiAdapter} from "@service/adapter/external/api/create.service.api.adapter";
import {UpdateServiceApiAdapter} from "@service/adapter/external/api/update.service.api.adapter";
import {ItemServiceApiAdapter} from "@service/adapter/external/api/item.service.api.adapter";
import {RemoveServiceApiAdapter} from "@service/adapter/external/api/remove.service.api.adapter";
import {ListServiceApiAdapter} from "@service/adapter/external/api/list.service.api.adapter";
import {ServiceActions} from "@service/state/service/service.actions";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {UnarchiveServiceApiAdapter} from "@service/adapter/external/api/unarchive.service.api.adapter";
import {
	ServiceContainerFormComponent
} from "@service/presentation/component/form/service-container–form/service-container–form.component";

export type IServiceState = IBaseState<Service.IService>

const defaults = baseDefaults<Service.IService>({
	filters: {},
	orderDir: OrderDirEnum.DESC,
	orderBy: OrderByEnum.CREATED_AT,
});

@State<IServiceState>({
	name: 'service',
	defaults
})
@Injectable()
export class ServiceState extends BaseState<IService> {

	protected override readonly unarchive = inject(UnarchiveServiceApiAdapter);
	protected override readonly archive = inject(ArchiveServiceApiAdapter);
	protected override readonly create = inject(CreateServiceApiAdapter);
	protected override readonly update = inject(UpdateServiceApiAdapter);
	protected override readonly item = inject(ItemServiceApiAdapter);
	protected override readonly remove = inject(RemoveServiceApiAdapter);
	protected override readonly list = inject(ListServiceApiAdapter);

	constructor() {
		super(
			defaults,
		);
	}

	// Application layer

	@Action(ServiceActions.CloseForm)
	public async closeForm(ctx: StateContext<IServiceState>) {

		const {ServiceContainerFormComponent} = await import("@service/presentation/component/form/service-container–form/service-container–form.component");

		this.pushBoxService.destroy$.next(ServiceContainerFormComponent);

	}

	@Action(ServiceActions.CloseDetails)
	public async closeDetails(ctx: StateContext<IServiceState>) {

		const {ServiceDetails} = await import("@service/presentation/component/service-details/service-details");

		this.pushBoxService.destroy$.next(ServiceDetails);

	}

	@Action(ServiceActions.OpenDetailsById)
	public async openDetailsById(ctx: StateContext<IServiceState>, action: ServiceActions.OpenDetailsById) {

		const item = await this.item.executeAsync(action.payload);

		const {ServiceDetails} = await import("@service/presentation/component/service-details/service-details");

		this.pushBoxService.observe$.next({
			component: ServiceDetails,
			inputs: {item},
		});

	}

	@Action(ServiceActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IServiceState>, action: ServiceActions.OpenFormToEditById) {

		const item = await this.item.executeAsync(action.payload);

		await this.openForm(ctx, {
			payload: {
				isEditMode: true,
				item,
			}
		});

	}

	@Action(ServiceActions.OpenForm)
	public async openForm(ctx: StateContext<IServiceState>, {payload}: ServiceActions.OpenForm): Promise<void> {

		const {ServiceContainerFormComponent} = await import("@service/presentation/component/form/service-container–form/service-container–form.component");

		this.pushBoxService.observe$.next({
			component: ServiceContainerFormComponent,
			inputs: payload,
		});

	}

	// API

	@Action(ServiceActions.Init)
	public override async init(ctx: StateContext<IServiceState>): Promise<void> {
		await super.init(ctx);
	}

	@Action(ServiceActions.UpdateFilters)
	public override updateFilters(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateFilters) {
		super.updateFilters(ctx, action);
	}

	@Action(ServiceActions.UpdateTableState)
	public override updateTableState(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateTableState) {
		super.updateTableState(ctx, action);
	}

	@Action(ServiceActions.CreateItem)
	public override async createItem(ctx: StateContext<IServiceState>, action: ServiceActions.CreateItem): Promise<void> {
		await super.createItem(ctx, action);
		await this.closeForm(ctx);
	}

	@Action(ServiceActions.UpdateItem)
	public override async updateItem(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
		await this.closeForm(ctx);
	}

	@Action(ServiceActions.GetItem)
	public override async getItem(ctx: StateContext<IServiceState>, action: ServiceActions.GetItem): Promise<void> {
		await super.getItem(ctx, action);
	}

	@Action(ServiceActions.DeleteItem)
	public override async deleteItem(ctx: StateContext<IServiceState>, action: ServiceActions.DeleteItem) {
		await super.deleteItem(ctx, action);
	}

	@Action(ServiceActions.GetList)
	public override async getList(ctx: StateContext<IServiceState>, action: ServiceActions.GetList): Promise<void> {
		await super.getList(ctx, action);

	}

	@Action(ServiceActions.ArchiveItem)
	public override async archiveItem(ctx: StateContext<IServiceState>, action: ServiceActions.ArchiveItem) {
		await super.archiveItem(ctx, action);
	}

	@Action(ServiceActions.UnarchiveItem)
	public override async unarchiveItem(ctx: StateContext<IServiceState>, action: ServiceActions.UnarchiveItem) {
		await super.unarchiveItem(ctx, action);
	}

	// Selectors

	@Selector()
	public static itemData(state: IServiceState) {
		return state.item.data;
	}

	@Selector()
	public static tableStateItems(state: IServiceState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IServiceState) {
		return state.tableState;
	}

}
