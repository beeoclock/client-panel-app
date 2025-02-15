import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum, LanguageCodeEnum} from '@utility/domain/enum';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {IDurationVersion, ILanguageVersion} from "../../../../../core/business-logic/service";
import {extractSecondsFrom_hh_mm_ss, STR_MINUTE_45} from "@utility/domain/time";
import {DurationVersionTypeEnum} from "../../../../../core/business-logic/service/enum/duration-version-type.enum";
import {filter} from "rxjs";
import {is} from "../../../../../core/shared/checker";
import {BaseEntityForm} from "@utility/base.form";
import {IServiceDto} from "../../../../../core/business-logic/order/interface/i.service.dto";

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

export interface IPriceForm {
	price: FormControl<number>;
	currency: FormControl<CurrencyCodeEnum>;
}

export class PriceForm extends FormGroup<IPriceForm> {
	constructor() {
		super({
			price: new FormControl(0, {
				nonNullable: true,
				validators: [Validators.min(0)],
			}),
			currency: new FormControl(),
			// preferredLanguages: new FormControl(),
		});
		this.initValue();
	}

	public initValue(): void {
		// this.controls.preferredLanguages.setValue([LanguageCodeEnum.en]);
		this.controls.currency.setValue(CurrencyCodeEnum.USD);
	}
}

export interface IDurationVersionForm {
	breakInSeconds: FormControl<number>;
	durationInSeconds: FormControl<number>;
	prices: PricesForm;
}

export class DurationVersionForm extends FormGroup<IDurationVersionForm> {
	constructor() {
		super({
			breakInSeconds: new FormControl(),
			durationInSeconds: new FormControl(),
			prices: new PricesForm(),
		});
		this.initValue();
	}

	public initValue(): void {
		this.controls.durationInSeconds.setValue(extractSecondsFrom_hh_mm_ss(STR_MINUTE_45));
	}

}

export class PricesForm extends FormArray<PriceForm> {
	constructor() {
		super([]);
		this.pushNewPriceForm();
	}

	public pushNewPriceForm(): void {
		this.push(new PriceForm());
	}

}

export interface IDurationConfigurationForm {
	durationVersionType: FormControl<DurationVersionTypeEnum>;
}

export class DurationConfigurationForm extends FormGroup<IDurationConfigurationForm> {
	constructor() {
		super({
			durationVersionType: new FormControl(),
		});
		this.initValue();
	}

	public initValue(): void {
		this.controls.durationVersionType.setValue(DurationVersionTypeEnum.VARIABLE);
	}

}

export interface IConfigurationForm {
	duration: DurationConfigurationForm;
}

export class ConfigurationForm extends FormGroup<IConfigurationForm> {
	constructor() {
		super({
			duration: new DurationConfigurationForm(),
		});
	}
}

export interface IPresentationForm {
	color: FormControl<string | null>;
}

export class PresentationForm extends FormGroup<IPresentationForm> {
	constructor() {
		super({
			color: new FormControl(),
		});
	}
}

export interface IPrepaymentPolicyForm {
	isRequired: FormControl<boolean>;
	isPercentage: FormControl<boolean>;
	value: FormControl<string>;
	minimalCancelTime: FormControl<string>;
}

export class PrepaymentPolicyForm extends FormGroup<IPrepaymentPolicyForm> {
	constructor() {
		super({
			isRequired: new FormControl(),
			isPercentage: new FormControl(),
			value: new FormControl(),
			minimalCancelTime: new FormControl(),
		});
	}
}

export class LanguageVersionsForm extends FormArray<LanguageVersionForm> {
	constructor() {
		super([]);
	}

	public pushNewOne(initialValue?: undefined | ILanguageVersion): void {
		const newOne = new LanguageVersionForm();
		if (initialValue) {
			newOne.patchValue(initialValue);
		}
		this.push(newOne);
	}

	public addNewLanguageVersionControl(languageCode: LanguageCodeEnum): void {
		const foundIndex = this.controls.findIndex((control) => control.controls.language.value === languageCode);
		if (foundIndex !== -1) {
			if (this.controls.length > 1) {
				this.removeAt(foundIndex);
			}
			return;
		}
		this.push(new LanguageVersionForm(languageCode));
	}

}

export class DurationVersionsForm extends FormArray<DurationVersionForm> {
	constructor() {
		super([new DurationVersionForm()]);
	}

	public pushNewOne(initialValue?: undefined | IDurationVersion): void {
		const newOne = new DurationVersionForm();
		if (initialValue) {
			newOne.patchValue(initialValue);
		}
		this.push(newOne);
	}

}

export interface IServiceDtoForm {
	// schedules: SchedulesForm;
	configuration: ConfigurationForm;
	prepaymentPolicy: PrepaymentPolicyForm;
	languageVersions: LanguageVersionsForm;
	durationVersions: DurationVersionsForm;
	order: FormControl<number | null>;
	presentation: PresentationForm;
}

export class ServiceForm extends BaseEntityForm<'ServiceDto', IServiceDtoForm> {
	constructor(initialValue: Partial<IServiceDto> = {}) {
		super('ServiceDto', {
			// schedules: new SchedulesForm(),
			configuration: new ConfigurationForm(),
			prepaymentPolicy: new PrepaymentPolicyForm(),
			languageVersions: new LanguageVersionsForm(),
			durationVersions: new DurationVersionsForm(),
			presentation: new PresentationForm(),
			order: new FormControl(),
		});
		this.initHandlers();
		this.patchValue(initialValue);
	}

	public override patchValue(value: Partial<IServiceDto>): void {
		super.patchValue(value);
		if (value.languageVersions) {
			this.controls.languageVersions.clear();
			value.languageVersions.forEach((languageVersion) => {
				this.controls.languageVersions.pushNewOne(languageVersion);
			});
		}
		if (value.durationVersions) {
			this.controls.durationVersions.clear();
			value.durationVersions.forEach((durationVersion) => {
				this.controls.durationVersions.pushNewOne(durationVersion);
			});
		}
	}

	public initHandlers(): void {
		this.controls.configuration.controls.duration.controls.durationVersionType.valueChanges.subscribe((value) => {
			switch (value) {
				case DurationVersionTypeEnum.RANGE:
					if (this.controls.durationVersions.controls.length === 1) {
						this.controls.durationVersions.pushNewOne();
					}
					break;
				case DurationVersionTypeEnum.VARIABLE:
					if (this.controls.durationVersions.controls.length > 1) {
						this.controls.durationVersions.controls = this.controls.durationVersions.controls.slice(0, 1);
					}
					break;
			}
		});
		this.controls.order.valueChanges.pipe(filter(is.string)).subscribe((value) => {
			this.controls.order.setValue(+value);
		});
	}

}
