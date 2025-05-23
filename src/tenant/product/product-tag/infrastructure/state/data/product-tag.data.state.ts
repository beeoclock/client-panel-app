import {inject, Injectable} from '@angular/core';
import {Action, State, StateContext} from '@ngxs/store';
import {TranslateService} from '@ngx-translate/core';
import {SharedUow} from "@core/shared/uow/shared.uow";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {IProductTag} from "@tenant/product/product-tag/domain";
import {ProductTagDataActions} from "@tenant/product/product-tag/infrastructure/state/data/product-tag.data.actions";
import {
	ProductTagPresentationActions
} from "@tenant/product/product-tag/infrastructure/state/presentation/product-tag.presentation.actions";
import EProductTag from "@tenant/product/product-tag/domain/entity/e.product-tag";

export type IProductDataState = IBaseState<IProductTag.DTO>;

const defaults = baseDefaults<IProductTag.DTO>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: 20,
});

@State<IProductDataState>({
	name: 'productTagData',
	defaults,
})
@Injectable()
export class ProductTagDataState {

	private readonly sharedUow = inject(SharedUow);
	private readonly translateService = inject(TranslateService);

	@Action(ProductTagDataActions.CreateItem)
	public async createItem(
		ctx: StateContext<IProductDataState>,
		action: ProductTagDataActions.CreateItem
	): Promise<void> {
		await this.sharedUow.productTag.repository.createAsync(EProductTag.fromDTO(action.payload));
		ctx.dispatch(new ProductTagPresentationActions.CloseForm());
	}

	@Action(ProductTagDataActions.UpdateItem)
	public async updateItem(
		ctx: StateContext<IProductDataState>,
		{payload: item}: ProductTagDataActions.UpdateItem
	): Promise<void> {
		const foundItem = await this.sharedUow.productTag.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = EProductTag.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.productTag.repository.updateAsync(entity);
			ctx.dispatch(new ProductTagPresentationActions.CloseForm());
			ctx.dispatch(new ProductTagPresentationActions.UpdateOpenedDetails(entity));
		}

	}


	@Action(ProductTagDataActions.SetState)
	public async setState(ctx: StateContext<IProductDataState>, {item, state}: ProductTagDataActions.SetState) {
		const foundItem = await this.sharedUow.productTag.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = EProductTag.fromRaw({
				...foundItem,
				...item,
			});
			entity.changeState(state);
			await this.sharedUow.productTag.repository.updateAsync(entity);
			ctx.dispatch(new ProductTagPresentationActions.UpdateOpenedDetails(entity));
		}
	}
}
