import {afterNextRender, ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Store} from '@ngxs/store';
import {NGXLogger} from 'ngx-logger';
import {
	ButtonSaveContainerComponent
} from "@shared/presentation/component/container/button-save/button-save.container.component";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {
	ProductTagNameComponent
} from "@tenant/product/product-tag/presentation/ui/component/form/product-tag-name/product-tag-name.component";
import {ProductTagForm} from "@tenant/product/product-tag/presentation/form/product-tag.form";
import {IProductTag} from "@tenant/product/product-tag/domain";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ProductTagDataActions} from "@tenant/product/product-tag/infrastructure/state/data/product-tag.data.actions";

@Component({
	selector: 'product-tag-form-page',
	templateUrl: './product-tag-form-container.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ButtonSaveContainerComponent,
		ProductTagNameComponent,
		TranslatePipe,
		PrimaryButtonDirective
	],
	standalone: true,
})
export class ProductTagFormContainerComponent {

	protected readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	public readonly form = new ProductTagForm();
	public readonly item = input<IProductTag.DTO | undefined>();
	public readonly isEditMode = input<{ value: string; label: string }[]>();

	public constructor() {
		afterNextRender(() => {
			this.detectItem();
		});
	}

	public detectItem(): void {
		const item = this.item();
		if (this.isEditMode() && item) {
			this.form.patchValue(item);
		}
	}

	public async save(): Promise<void> {
		this.validateForm();

		if (this.form.invalid) {
			this.ngxLogger.error('Form is invalid', this.form);
			return;
		}

		this.form.disable();
		this.form.markAsPending();

		if (this.isEditMode()) {
			await this.updateProduct();
		} else {
			await this.createProduct();
		}

		this.form.enable();
		this.form.updateValueAndValidity();
	}

	private validateForm(): void {
		this.form.markAllAsTouched();
		this.form.updateValueAndValidity();
	}

	@Dispatch()
	private async createProduct() {
		return new ProductTagDataActions.CreateItem(this.form.getRawValue());
	}

	@Dispatch()
	private async updateProduct() {
		return new ProductTagDataActions.UpdateItem(this.form.getRawValue());
	}

}

export default ProductTagFormContainerComponent;
