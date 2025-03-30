import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import ECustomer from "@tenant/customer/domain/entity/e.customer";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {CustomerDataActions} from "./customer.data.actions";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";

export type ICustomerState = IBaseState<ECustomer>;

const defaults = baseDefaults<ECustomer>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<ICustomerState>({
	name: 'customerData',
	defaults,
})
@Injectable()
export class CustomerDataState {

	private readonly sharedUow = inject(SharedUow);

	@Action(CustomerDataActions.CreateItem)
	public async createItem(ctx: StateContext<ICustomerState>, action: CustomerDataActions.CreateItem): Promise<void> {
		await this.sharedUow.customer.repository.createAsync(ECustomer.fromDTO(action.payload));
		ctx.dispatch(new CustomerPresentationActions.CloseForm());
	}

	@Action(CustomerDataActions.UpdateItem)
	public async updateItem(ctx: StateContext<ICustomerState>, {payload: item}: CustomerDataActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.customer.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = ECustomer.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.customer.repository.updateAsync(entity);
			ctx.dispatch(new CustomerPresentationActions.CloseForm());
			ctx.dispatch(new CustomerPresentationActions.UpdateOpenedDetails(entity));
		}
	}

	@Action(CustomerDataActions.SetState)
	public async setState(ctx: StateContext<ICustomerState>, {item, state}: CustomerDataActions.SetState) {
		const foundItem = await this.sharedUow.customer.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = ECustomer.fromRaw({
				...foundItem,
				...item,
			});
			entity.changeState(state);
			await this.sharedUow.customer.repository.updateAsync(entity);
			ctx.dispatch(new CustomerPresentationActions.UpdateOpenedDetails(entity));
		}
	}

}
