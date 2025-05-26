import {AsyncPipe} from '@angular/common';
import {ChangeDetectorRef, Component, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {Store} from '@ngxs/store';
import {NGXLogger} from 'ngx-logger';
import {firstValueFrom, map} from 'rxjs';
import {ProductNameFormComponent} from './product-name/product-name-form.container';
import {
	ButtonSaveContainerComponent
} from "@shared/presentation/component/container/button-save/button-save.container.component";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {FormInputComponent} from "@shared/presentation/component/input/form.input.component";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";
import {ProductForm} from "@tenant/product/product/presentation/form/product.form";
import {IProduct} from "@tenant/product/product/domain";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {ProductDataActions} from "@tenant/product/product/infrastructure/state/data/product.data.actions";
import EProduct from "@tenant/product/product/domain/entity/e.product";
import {PriceAndCurrencyComponent} from "@shared/presentation/component/input/price-and-currency.component";
import {IonSelectServiceComponent} from "@shared/presentation/component/input/ion/ion-select-product-tag.component";

@Component({
	selector: 'product-form-page',
	templateUrl: './product-form-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		ButtonSaveContainerComponent,
		PrimaryButtonDirective,
		FormInputComponent,
		AsyncPipe,
		CardComponent,
		PriceAndCurrencyComponent,
		ProductNameFormComponent,
		DefaultLabelDirective,
		IonSelectServiceComponent,
	],
	standalone: true,
})
export class ProductFormContainerComponent implements OnInit {
	readonly #store = inject(Store);
	readonly #ngxLogger = inject(NGXLogger);
	readonly #changeDetectorRef = inject(ChangeDetectorRef);

	public readonly form = new ProductForm();
	public readonly item = input<IProduct.DTO | undefined>();
	public readonly isEditMode = input<{ value: string; label: string }[]>();
	public readonly availableLanguages$ = this.#store.select(
		BusinessProfileState.availableLanguages
	);

	public readonly currencyList$ = this.#store
		.select(BusinessProfileState.currencies)
		.pipe(
			map((currencies) => {
				return (currencies ?? []).map((currency) => ({
					id: currency,
					name: currency,
				}));
			})
		);

	public ngOnInit(): void {
		this.detectItem();
	}

	public detectItem(): void {
		const item = this.item();
		if (this.isEditMode() && item) {
			this.updateFormValues(item);
		}
	}

	private updateFormValues(item: IProduct.DTO) {
		const { languageVersions, ...rest } = item;

		this.form.patchValue(rest);

		if (languageVersions) {
			// Prevents from removing all controls from languageVersions
			this.form.controls.languageVersions.clear();
			// Add new controls to languageVersions
			languageVersions.forEach((languageVersion) => {
				this.form.controls.languageVersions.pushNewOne(languageVersion);
			});
		}

		this.form.updateValueAndValidity();
		this.#changeDetectorRef.detectChanges();
	}

	public async save(): Promise<void> {
		this.validateForm();

		if (this.form.invalid) {
			this.#ngxLogger.error('Form is invalid', this.form);
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

	private formValue() {
		return this.form.getRawValue() as IProduct.DTO;
	}

	private async createProduct(): Promise<void> {
		const entity = EProduct.fromDTO(this.formValue());
		const action = new ProductDataActions.CreateItem(entity);
		const action$ = this.#store.dispatch(action)
		await firstValueFrom(action$);
	}

	private async updateProduct(): Promise<void> {
		const entity = EProduct.fromDTO(this.formValue());
		const action = new ProductDataActions.UpdateItem(entity);
		const action$ = this.#store.dispatch(action)
		await firstValueFrom(action$);
	}
}

export default ProductFormContainerComponent;
