import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";
import {AttachPluginUseCase} from "@tenant/plugin/tenant-plugin/application/use-case/attach.plugin.use-case";
import {IPluginState} from "@tenant/plugin/plugin/infrastructure/state/data/plugin.data.state";
import {AttachPluginApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/attach-plugin.api";
import {
	TenantPluginDataActions
} from "@tenant/plugin/tenant-plugin/infrastructure/state/data/tenant-plugin.data.actions";
import {NGXLogger} from "ngx-logger";
import {DetachPluginUseCase} from "@tenant/plugin/tenant-plugin/application/use-case/detach.plugin.use-case";
import {DetachPluginApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/detach-plugin.api";
import {SyncManager} from "@core/system/infrastructure/sync-manager/sync-manager";

export type ICustomerState = IBaseState<ETenantPlugin>;

const defaults = baseDefaults<ETenantPlugin>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<ICustomerState>({
	name: 'tenantPluginData',
	defaults,
})
@Injectable()
export class TenantPluginDataState {

	private readonly sharedUow = inject(SharedUow);
	private readonly attachPluginApi = inject(AttachPluginApi);
	private readonly detachPluginApi = inject(DetachPluginApi);
	private readonly ngxLogger = inject(NGXLogger);

	@Action(TenantPluginDataActions.Attach)
	public async attach(ctx: StateContext<IPluginState>, action: TenantPluginDataActions.Attach): Promise<void> {
		const attachPluginUseCase = new AttachPluginUseCase(this.attachPluginApi);
		await attachPluginUseCase.execute(action.payload);
		await SyncManager.syncAll();
	}

	@Action(TenantPluginDataActions.Detach)
	public async detach(ctx: StateContext<IPluginState>, action: TenantPluginDataActions.Detach): Promise<void> {
		const detachPluginUseCase = new DetachPluginUseCase(this.detachPluginApi);
		await detachPluginUseCase.execute(action.payload);
		await SyncManager.syncAll();
	}

	// @Action(TenantPluginDataActions.UpdateItem)
	// public async updateItem(ctx: StateContext<ICustomerState>, {payload: item}: TenantPluginDataActions.UpdateItem): Promise<void> {
	// 	const foundItem = await this.sharedUow.customer.repository.findByIdAsync(item._id);
	// 	if (foundItem) {
	// 		const entity = ETe.fromRaw({
	// 			...foundItem,
	// 			...item,
	// 		});
	// 		await this.sharedUow.customer.repository.updateAsync(entity);
	// 		ctx.dispatch(new CustomerPresentationActions.CloseForm());
	// 		ctx.dispatch(new CustomerPresentationActions.UpdateOpenedDetails(entity));
	// 	}
	// }

	// @Action(TenantPluginDataActions.SetState)
	// public async setState(ctx: StateContext<ICustomerState>, {item, state}: TenantPluginDataActions.SetState) {
	// 	const foundItem = await this.sharedUow.customer.repository.findByIdAsync(item._id);
	// 	if (foundItem) {
	// 		const entity = ECustomer.fromRaw({
	// 			...foundItem,
	// 			...item,
	// 		});
	// 		entity.changeState(state);
	// 		await this.sharedUow.customer.repository.updateAsync(entity);
	// 		ctx.dispatch(new CustomerPresentationActions.UpdateOpenedDetails(entity));
	// 	}
	// }

}
