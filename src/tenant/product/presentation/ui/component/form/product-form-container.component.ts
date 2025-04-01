import {AsyncPipe} from '@angular/common';
import {ChangeDetectorRef, Component, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {Store} from '@ngxs/store';
import {IProduct} from '@product/domain';
import {ClientState} from '@client/state/client/client.state';
import {ProductForm} from '@product/domain/model/product.form';
import {ProductActions} from '@product/state/product/product.actions';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {
	ButtonSaveContainerComponent
} from '@utility/presentation/component/container/button-save/button-save.container.component';
import {FormInputComponent} from '@utility/presentation/component/input/form.input.component';
import {IonSelectTagsComponent} from '@utility/presentation/component/input/ion/ion-select-tags.component';
import {PriceAndCurrencyComponent} from '@utility/presentation/component/input/price-and-currency.component';
import {
	SwitchActiveBlockComponent
} from '@utility/presentation/component/switch/switch-active/switch-active-block.component';
import {PrimaryButtonDirective} from '@utility/presentation/directives/button/primary.button.directive';
import {DefaultLabelDirective} from '@utility/presentation/directives/label/default.label.directive';
import ObjectID from 'bson-objectid';
import {NGXLogger} from 'ngx-logger';
import {firstValueFrom, map} from 'rxjs';
import {ProductNameFormComponent} from './product-name/product-name-form.container';

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
		SwitchActiveBlockComponent,
		PriceAndCurrencyComponent,
		ProductNameFormComponent,
		IonSelectTagsComponent,
		DefaultLabelDirective,
	],
	standalone: true,
})
export class ProductFormContainerComponent implements OnInit {
	readonly #store = inject(Store);
	readonly #ngxLogger = inject(NGXLogger);
	readonly #changeDetectorRef = inject(ChangeDetectorRef);

	public readonly form = new ProductForm();
	public readonly item = input<IProduct | undefined>();
	public readonly isEditMode = input<{ value: string; label: string }[]>();
	public readonly availableLanguages$ = this.#store.select(
		ClientState.availableLanguages
	);
	public tagsOptions: {
		id: string;
		value: string;
		label: string;
	}[] = [];
	public readonly currencyList$ = this.#store
		.select(ClientState.currencies)
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

	private updateFormValues(item: IProduct) {
		const { languageVersions, tags, ...rest } = item;

		this.form.patchValue({
			tags,
			...rest,
		});

		if (tags) {
			tags.map((tag) => {
				this.tagsOptions.push({
					id: ObjectID().toHexString(),
					value: tag,
					label: tag,
				});
			});
		}

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
		return this.form.getRawValue() as IProduct;
	}

	private async createProduct(): Promise<void> {
		await firstValueFrom(
			this.#store.dispatch(
				new ProductActions.CreateItem(this.formValue())
			)
		);
	}

	private async updateProduct(): Promise<void> {
		await firstValueFrom(
			this.#store.dispatch(
				new ProductActions.UpdateItem(this.formValue())
			)
		);
	}
}
