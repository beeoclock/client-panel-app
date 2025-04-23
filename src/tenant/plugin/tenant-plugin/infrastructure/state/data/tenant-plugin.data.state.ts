import {inject, Injectable} from "@angular/core";
import {State} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";

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

	// @Action(TenantPluginDataActions.CreateItem)
	// public async createItem(ctx: StateContext<ICustomerState>, action: TenantPluginDataActions.CreateItem): Promise<void> {
	// 	await this.sharedUow.customer.repository.createAsync(ECustomer.fromDTO(action.payload));
	// 	ctx.dispatch(new CustomerPresentationActions.CloseForm());
	// }

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
