import {inject, Injectable} from "@angular/core";
import {State} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import EPlugin from "@tenant/plugin/plugin/domain/entity/e.plugin-store";

export type IPluginState = IBaseState<EPlugin>;

const defaults = baseDefaults<EPlugin>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IPluginState>({
	name: 'pluginData',
	defaults,
})
@Injectable()
export class PluginDataState {

	private readonly sharedUow = inject(SharedUow);

	//
	// @Action(PluginDataActions.UpdateItem)
	// public async updateItem(ctx: StateContext<ICustomerState>, {payload: item}: PluginDataActions.UpdateItem): Promise<void> {
	// 	const foundItem = await this.sharedUow.customer.repository.findByIdAsync(item._id);
	// 	if (foundItem) {
	// 		const entity = ECustomer.fromRaw({
	// 			...foundItem,
	// 			...item,
	// 		});
	// 		await this.sharedUow.customer.repository.updateAsync(entity);
	// 		ctx.dispatch(new CustomerPresentationActions.CloseForm());
	// 		ctx.dispatch(new CustomerPresentationActions.UpdateOpenedDetails(entity));
	// 	}
	// }
	//
	// @Action(PluginDataActions.SetState)
	// public async setState(ctx: StateContext<ICustomerState>, {item, state}: PluginDataActions.SetState) {
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
