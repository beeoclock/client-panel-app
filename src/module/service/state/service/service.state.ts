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
import {TranslateService} from "@ngx-translate/core";

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
	protected override readonly delete = inject(RemoveServiceApiAdapter);
	protected override readonly paged = inject(ListServiceApiAdapter);

	private readonly translateService = inject(TranslateService);

	constructor() {
		super(
			defaults,
		);
	}

	// Application layer

	@Action(ServiceActions.CloseDetails)
	public async closeDetails(ctx: StateContext<IServiceState>, action?: ServiceActions.CloseDetails) {

		const {ServiceDetails} = await import("@service/presentation/component/service-details/service-details");

		await this.pushBoxService.destroyComponent(ServiceDetails);

	}

	@Action(ServiceActions.CloseForm)
	public async closeForm(ctx: StateContext<IServiceState>, action?: ServiceActions.CloseForm) {

		const {ServiceContainerFormComponent} = await import("@service/presentation/component/form/service-container–form/service-container–form.component");

		await this.pushBoxService.destroyComponent(ServiceContainerFormComponent);

	}

	@Action(ServiceActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IServiceState>, {payload}: ServiceActions.UpdateOpenedDetails) {

		const {ServiceDetails} = await import("@service/presentation/component/service-details/service-details");

		await this.pushBoxService.updatePushBoxComponentAsync({
			component: ServiceDetails,
			componentInputs: {item: payload},
		});

	}

	@Action(ServiceActions.OpenDetailsById)
	public async openDetailsById(ctx: StateContext<IServiceState>, {payload: id}: ServiceActions.OpenDetailsById) {

		const title = this.translateService.instant('service.details.title');

		const {ServiceDetails} = await import("@service/presentation/component/service-details/service-details");

		await this.pushBoxService.buildItAsync({
			title,
			showLoading: true,
			component: ServiceDetails,
		});

		const item = await this.item.executeAsync(id);

		await this.pushBoxService.updatePushBoxComponentAsync({
			component: ServiceDetails,
			componentInputs: {item},
		});

	}

	@Action(ServiceActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IServiceState>, {payload: id}: ServiceActions.OpenFormToEditById) {

		const title = this.translateService.instant('service.form.title.edit');

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					id,
					showLoading: true,
					title
				}
			}
		});

		const item = await this.item.executeAsync(id);

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					id,
					title,
				},
				componentInputs: {
					item,
					isEditMode: true,
				}
			}
		});

	}

	@Action(ServiceActions.OpenForm)
	public async openForm(ctx: StateContext<IServiceState>, {payload}: ServiceActions.OpenForm): Promise<void> {

		const {ServiceContainerFormComponent} = await import("@service/presentation/component/form/service-container–form/service-container–form.component");

		const {pushBoxInputs, componentInputs} = payload ?? {};

		await this.pushBoxService.buildItAsync({
			title: this.translateService.instant('service.form.title.create'),
			...pushBoxInputs,
			component: ServiceContainerFormComponent,
			componentInputs,
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
	public override async createItem(ctx: StateContext<IServiceState>, action: ServiceActions.CreateItem) {
		await super.createItem(ctx, action);
		await this.closeForm(ctx);
	}

	@Action(ServiceActions.UpdateItem)
	public override async updateItem(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
		await this.closeForm(ctx, {
			payload: action.payload._id
		});
		const {data} = ctx.getState().item;
		data && await this.updateOpenedDetails(ctx, {payload: data});
	}

	@Action(ServiceActions.GetItem)
	public override async getItem(ctx: StateContext<IServiceState>, action: ServiceActions.GetItem): Promise<void> {
		await super.getItem(ctx, action);
	}

	@Action(ServiceActions.DeleteItem)
	public override async deleteItem(ctx: StateContext<IServiceState>, action: ServiceActions.DeleteItem) {
		await super.deleteItem(ctx, action);
		await this.closeDetails(ctx, action);
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
