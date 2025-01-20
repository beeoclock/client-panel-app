import { Injectable, inject } from '@angular/core';
import { Selector, State, StateContext, Action } from '@ngxs/store';
import * as Product from "@product/domain";
import {
	baseDefaults,
	BaseState,
	IBaseState,
} from '@utility/state/base/base.state';
import { OrderByEnum, OrderDirEnum } from '@utility/domain/enum';
import { ProductActions } from './product.actions';
import { ListProductApiAdapter } from '@product/adapter/external/api/list.product.api.adapter';
import { DeleteProductApiAdapter } from '@product/adapter/external/api/delete.product.api.adapter';
import { ItemProductApiAdapter } from '@product/adapter/external/api/item.product.api.adapter';
import { UpdateProductApiAdapter } from '@product/adapter/external/api/update.product.api.adapter';
import { CreateProductApiAdapter } from '@product/adapter/external/api/create.product.api.adapter';
import { TranslateService } from '@ngx-translate/core';

export type IProductState = IBaseState<Product.IProduct>;

const defaults = baseDefaults<Product.IProduct>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: 20,
});

@State<IProductState>({
	name: 'product',
	defaults,
})
@Injectable()
export class ProductState extends BaseState<Product.IProduct> {

	protected override readonly create = inject(CreateProductApiAdapter);
	protected override readonly update = inject(UpdateProductApiAdapter);
	protected override readonly item = inject(ItemProductApiAdapter);
	protected override readonly delete = inject(DeleteProductApiAdapter);
	protected override readonly paged = inject(ListProductApiAdapter);

	private readonly translateService = inject(TranslateService);

	constructor() {
		super(defaults);
	}

	// Application layer

	@Action(ProductActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IProductState>, {payload}: ProductActions.OpenDetails) {
	
		const title = await this.translateService.instant('product.details.title');

		const {ProductDetailsContainerComponent} = await import("@product/presentation/component/details/product-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			componentInputs: {
				item: payload
			},
			component: ProductDetailsContainerComponent,
		});
	
	}

	@Action(ProductActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IProductState>, action: ProductActions.OpenFormToEditById) {
	
		const item = await this.item.executeAsync(action.payload);
		const title = await this.translateService.instant('product.form.title.edit');

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					title,
					id: action.payload,
				},
				componentInputs: {
					item,
					isEditMode: true,
				}
			}
		});
	
	}

	@Action(ProductActions.CloseDetails)
	public async closeDetails(ctx: StateContext<IProductState>, action?: ProductActions.CloseDetails) {
		const {ProductDetailsContainerComponent} = await import("@product/presentation/component/details/product-details-container.component");

		await this.whacAMaleProvider.destroyComponent(ProductDetailsContainerComponent);
	}

	@Action(ProductActions.OpenForm)
	public async openForm(ctx: StateContext<IProductState>, {payload}: ProductActions.OpenForm): Promise<void> {
	
		const {ProductFormContainerComponent} = await import("@product/presentation/component/form/product-form-container.component");

		const {componentInputs, pushBoxInputs} = payload ?? {};

		await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('product.form.title.create'),
			...pushBoxInputs,
			component: ProductFormContainerComponent,
			componentInputs,
		});
	}

	// API

	@Action(ProductActions.Init)
	public override async init(ctx: StateContext<IProductState>): Promise<void> {
		await super.init(ctx);
	}

	@Action(ProductActions.UpdateFilters)
	public override updateFilters(ctx: StateContext<IProductState>, action: ProductActions.UpdateFilters) {
		super.updateFilters(ctx, action);
	}

	@Action(ProductActions.UpdateTableState)
	public override updateTableState(ctx: StateContext<IProductState>, action: ProductActions.UpdateTableState) {
		super.updateTableState(ctx, action);
	}

	@Action(ProductActions.GetItem)
	public override async getItem(ctx: StateContext<IProductState>, action: ProductActions.GetItem): Promise<void> {
		await super.getItem(ctx, action);
	}

	@Action(ProductActions.CreateItem)
	public override async createItem(ctx: StateContext<IProductState>, action: ProductActions.CreateItem): Promise<void> {
		await super.createItem(ctx, action);
	}

	@Action(ProductActions.UpdateItem)
	public override async updateItem(ctx: StateContext<IProductState>, action: ProductActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
	}

	@Action(ProductActions.DeleteItem)
	public override async deleteItem(ctx: StateContext<IProductState>, action: ProductActions.DeleteItem) {
		await super.deleteItem(ctx, action);
		await this.closeDetails(ctx, action);
	}

	@Action(ProductActions.GetList)
	public override async getList(ctx: StateContext<IProductState>, action: ProductActions.GetList): Promise<void> {
		await super.getList(ctx, action);
	}

	// Selectors
	@Selector()
	public static itemData(state: IProductState) {
		return state.item.data;
	}

	@Selector()
	public static tableStateItems(state: IProductState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IProductState) {
		return state.tableState;
	}

	@Selector()
	public static tableStateFilters(state: IProductState) {
		return state.tableState.filters;
	}
}
