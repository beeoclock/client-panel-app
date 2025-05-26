import {AbstractControl, FormArray, FormControl, FormGroup, Validators,} from '@angular/forms';
import {IProduct, IProductLanguageVersion} from '../../domain/interface';
import {filter} from 'rxjs';
import {ActiveEnum, CurrencyCodeEnum, LanguageCodeEnum} from "@core/shared/enum";
import {BaseEntityForm} from "@shared/base.form";
import {is} from "@core/shared/checker";
import {IMedia} from "@tenant/media/domain/interface/i.media";

export interface IPriceForm {
	value: FormControl<number>;
	currency: FormControl<CurrencyCodeEnum>;
}

export class PriceForm extends FormGroup<IPriceForm> {
	constructor() {
		super({
			value: new FormControl(0, {
				nonNullable: true,
				validators: [Validators.min(0)],
			}),
			currency: new FormControl(),
		});
		this.initValue();
	}

	public initValue(): void {
		this.controls.value.setValidators(Validators.required);
		this.controls.currency.setValidators(Validators.required);
	}
}

export interface ILanguageVersionForm {
	title: FormControl<string>;
	description: FormControl<string>;
	language: FormControl<LanguageCodeEnum>;
	active: FormControl<ActiveEnum>;

	[key: string]: AbstractControl;
}

export class LanguageVersionForm extends FormGroup<ILanguageVersionForm> {
	constructor(
		public readonly language: LanguageCodeEnum = LanguageCodeEnum.en
	) {
		super({
			title: new FormControl(),
			description: new FormControl(),
			language: new FormControl(language, {
				nonNullable: true,
			}),
			active: new FormControl(ActiveEnum.YES, {
				nonNullable: true,
			}),
		});
		this.initValidators();
	}

	public initValidators(): void {
		this.controls.title.setValidators([Validators.required]);
		this.controls.description.setValidators([Validators.maxLength(10_000)]);
		this.controls.language.setValidators([Validators.required]);
	}
}

export class LanguageVersionsForm extends FormArray<LanguageVersionForm> {
	constructor() {
		super([]);
	}

	public pushNewOne(initialValue?: IProductLanguageVersion): void {
		const newOne = new LanguageVersionForm();
		if (initialValue) {
			newOne.patchValue(initialValue);
		}
		this.push(newOne);
	}

	public addNewLanguageVersionControl(languageCode: LanguageCodeEnum): void {
		const foundIndex = this.controls.findIndex(
			(control) => control.controls.language.value === languageCode
		);
		if (foundIndex !== -1) {
			if (this.controls.length > 1) {
				this.removeAt(foundIndex);
			}
			return;
		}
		this.push(new LanguageVersionForm(languageCode));
	}
}

export interface IProductForm {
	languageVersions: LanguageVersionsForm;
	price: PriceForm;
	order: FormControl<number | null>;
	tags: FormControl<string[] | null>;
	sku: FormControl<string>;
	images: FormControl<IMedia[]>;
}

export class ProductForm extends BaseEntityForm<'ProductDto', IProductForm> {
	constructor(initialValue: Partial<IProduct.DTO> = {}) {
		super('ProductDto', {
			sku: new FormControl('SKU-' + new Date().getTime(), {
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(3)],
			}),
			languageVersions: new LanguageVersionsForm(),
			price: new PriceForm(),
			tags: new FormControl([]),
			order: new FormControl(null),
			images: new FormControl([], {
				nonNullable: true,
			}),
		});
		this.initHandlers();
		this.patchValue(initialValue);
	}

	public override patchValue(value: Partial<IProduct.DTO>): void {
		super.patchValue(value);
		if (value.languageVersions) {
			this.controls.languageVersions.clear();
			value.languageVersions.forEach((languageVersion) => {
				this.controls.languageVersions.pushNewOne(languageVersion);
			});
		}
	}

	public initHandlers(): void {
		this.controls.order.valueChanges
			.pipe(filter(is.string))
			.subscribe((value) => {
				this.controls.order.setValue(+value);
			});
	}
}
