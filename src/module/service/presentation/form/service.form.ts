import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum, LanguageCodeEnum, LANGUAGES} from '@utility/domain/enum';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {IDurationVersion, IService} from "@service/domain";
import {SchedulesForm} from "@utility/presentation/form/schdeule.form";
import {extractSecondsFrom_hh_mm_ss, STR_MINUTE_45} from "@utility/domain/time";
import {ISpecialist} from "@service/domain/interface/i.specialist";

export interface ILanguageVersionForm {
	title: FormControl<string>;
	description: FormControl<string>;
	language: FormControl<LanguageCodeEnum>;
	active: FormControl<ActiveEnum>;

	[key: string]: AbstractControl<any, any>;
}

export class LanguageVersionForm extends FormGroup<ILanguageVersionForm> {
	constructor(
		public readonly language: LanguageCodeEnum = LanguageCodeEnum.en
	) {
		super({
			title: new FormControl(),
			description: new FormControl(),
			language: new FormControl(),
			active: new FormControl(),
		});
		this.initValidators();
		this.initValue();
	}

	public initValidators(): void {
		this.controls.title.setValidators([Validators.required]);
		this.controls.description.setValidators([Validators.required]);
		this.controls.language.setValidators([Validators.required]);
	}

	public initValue(): void {
		this.controls.language.setValue(this.language);
		this.controls.active.setValue(ActiveEnum.YES);
	}
}

export interface IPriceForm {
	price: FormControl<number>;
	currency: FormControl<CurrencyCodeEnum>;

	[key: string]: AbstractControl<any, any>;
}

export class PriceForm extends FormGroup<IPriceForm> {
	constructor() {
		super({
			price: new FormControl(),
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

	[key: string]: AbstractControl<any, any>;
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

export interface IConfigurationForm {
	earliestDateTime: FormControl<string>;
	latestDateTime: FormControl<string>;

	[key: string]: AbstractControl<any, any>;
}

export class ConfigurationForm extends FormGroup<IConfigurationForm> {
	constructor() {
		super({
			earliestDateTime: new FormControl(),
			latestDateTime: new FormControl(),
		});
	}
}

export interface IPrepaymentPolicyForm {
	isRequired: FormControl<boolean>;
	isPercentage: FormControl<boolean>;
	value: FormControl<string>;
	minimalCancelTime: FormControl<string>;

	[key: string]: AbstractControl<any, any>;
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
		super([new LanguageVersionForm()]);
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

export interface IServiceForm {
	schedules: SchedulesForm;
	configuration: ConfigurationForm;
	prepaymentPolicy: PrepaymentPolicyForm;
	languageVersions: LanguageVersionsForm;
	durationVersions: DurationVersionsForm;
	_id: FormControl<string>;
	specialists: FormControl<ISpecialist[]>;
	active: FormControl<ActiveEnum>;

	[key: string]: AbstractControl<any, any>;
}

export class ServiceForm extends FormGroup<IServiceForm> {
	constructor(initialValue?: IService) {
		super({
			schedules: new SchedulesForm(),
			configuration: new ConfigurationForm(),
			prepaymentPolicy: new PrepaymentPolicyForm(),
			languageVersions: new LanguageVersionsForm(),
			durationVersions: new DurationVersionsForm(),
			specialists: new FormControl(),
			active: new FormControl(),
			_id: new FormControl()
		});
		this.initValue(initialValue);
	}

	public initValue(initialValue?: IService): void {
		this.controls.specialists.setValue([]);
		this.controls.active.setValue(ActiveEnum.YES);
		if (initialValue) {
			Object.keys(initialValue).forEach(key => {
				if (this.contains(key)) {
					this.controls[key].setValue((initialValue as any)[key]);
				}
			});
		}
	}

	public pushNewLanguageVersionForm(): void {
		for (const language of LANGUAGES) {
			if (Object.values(this.controls.languageVersions.controls).map(({language}) => language).includes(language.code)) {
				continue;
			}
			this.addNewLanguageVersionControl(language.code);
			break;
		}
	}

	public addNewLanguageVersionControl(languageCode: LanguageCodeEnum): void {
		this.controls.languageVersions.push(new LanguageVersionForm(languageCode));
	}

}
