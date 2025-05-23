import {inject, Injectable} from '@angular/core';
import {Action, State, StateContext} from '@ngxs/store';
import {TranslateService} from '@ngx-translate/core';
import {SharedUow} from "@core/shared/uow/shared.uow";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {IProduct} from "@tenant/product/product/domain";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {ProductDataActions} from "@tenant/product/product/infrastructure/state/data/product.data.actions";
import EProduct from "@tenant/product/product/domain/entity/e.product";
import {
	ProductPresentationActions
} from "@tenant/product/product/infrastructure/state/presentation/product.presentation.actions";

export type IProductDataState = IBaseState<IProduct.DTO>;

const defaults = baseDefaults<IProduct.DTO>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: 20,
});

@State<IProductDataState>({
	name: 'productData',
	defaults,
})
@Injectable()
export class ProductDataState {

	private readonly sharedUow = inject(SharedUow);
	private readonly translateService = inject(TranslateService);

	@Action(ProductDataActions.CreateItem)
	public async createItem(
		ctx: StateContext<IProductDataState>,
		action: ProductDataActions.CreateItem
	): Promise<void> {
		await this.sharedUow.product.repository.createAsync(EProduct.fromDTO(action.payload));
		ctx.dispatch(new ProductPresentationActions.CloseForm());
	}

	@Action(ProductDataActions.UpdateItem)
	public async updateItem(
		ctx: StateContext<IProductDataState>,
		{payload: item}: ProductDataActions.UpdateItem
	): Promise<void> {
		const foundItem = await this.sharedUow.product.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = EProduct.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.product.repository.updateAsync(entity);
			ctx.dispatch(new ProductPresentationActions.CloseForm());
			ctx.dispatch(new ProductPresentationActions.UpdateOpenedDetails(entity));
		}

	}


	@Action(ProductDataActions.SetState)
	public async setState(ctx: StateContext<IProductDataState>, {item, state}: ProductDataActions.SetState) {
		const foundItem = await this.sharedUow.product.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = EProduct.fromRaw({
				...foundItem,
				...item,
			});
			entity.changeState(state);
			await this.sharedUow.product.repository.updateAsync(entity);
			ctx.dispatch(new ProductPresentationActions.UpdateOpenedDetails(entity));
		}
	}
}
