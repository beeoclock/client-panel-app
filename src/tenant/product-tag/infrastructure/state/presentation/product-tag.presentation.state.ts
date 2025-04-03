import {inject, Injectable} from '@angular/core';
import {Action, State, StateContext} from '@ngxs/store';
import {TranslateService} from '@ngx-translate/core';
import {SharedUow} from "@core/shared/uow/shared.uow";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {IProduct} from "@tenant/product/domain";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import {
	ProductDetailsContainerComponent
} from "@tenant/product/presentation/ui/component/details/product-details-container.component";
import {
	ProductFormContainerComponent
} from '@tenant/product/presentation/ui/component/form/product-form-container.component';
import {
	ProductTagPresentationActions
} from "@tenant/product-tag/infrastructure/state/presentation/product-tag.presentation.actions";

export type IProductPresentationState = IBaseState<IProduct.DTO>;

const defaults = baseDefaults<IProduct.DTO>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: 20,
});

@State<IProductPresentationState>({
	name: 'productTagPresentation',
	defaults,
})
@Injectable()
export class ProductTagPresentationState {

	private readonly secondRouterOutletService = inject(SecondRouterOutletService);
	private readonly router = inject(Router);
	private readonly sharedUow = inject(SharedUow);
	private readonly translateService = inject(TranslateService);

	@Action(ProductTagPresentationActions.OpenDetails)
	public async openDetailsAction(
		ctx: StateContext<IProductPresentationState>,
		{payload}: ProductTagPresentationActions.OpenDetails
	) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof ProductDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					const action = new ProductTagPresentationActions.CloseDetails();
					ctx.dispatch(action);
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['product-tag', payload._id]}}]);

	}

	@Action(ProductTagPresentationActions.CloseDetails)
	public async closeDetails() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(ProductTagPresentationActions.CloseForm)
	public async closeForm() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(ProductTagPresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetails(
		ctx: StateContext<IProductPresentationState>,
		{payload}: ProductTagPresentationActions.UpdateOpenedDetails
	) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {

			if (activated instanceof ProductDetailsContainerComponent) {

				const {_id} = activated.item() ?? {};

				if (_id === payload._id) {


					await this.router.navigate([{outlets: {second: ['product-tag', payload._id]}}], {
						onSameUrlNavigation: 'reload',
					});

				}

			}

		}
	}

	@Action(ProductTagPresentationActions.OpenForm)
	public async openForm(
		ctx: StateContext<IProductPresentationState>,
		{payload}: ProductTagPresentationActions.OpenForm
	): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof ProductFormContainerComponent) {
				const isEditMode = activated.isEditMode();
				if (isEditMode) {
					const {_id} = activated.item() ?? {};
					if (_id === payload?.componentInputs?.item?._id) {
						const action = new ProductTagPresentationActions.CloseForm();
						ctx.dispatch(action);
						return;
					}
				} else {
					const action = new ProductTagPresentationActions.CloseForm();
					ctx.dispatch(action);
					return;
				}
			}
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['product-tag', payload.componentInputs.item?._id, 'form']}}]);
		} else {
			await this.router.navigate([{outlets: {second: ['product-tag', 'form']}}]);
		}

	}

}
