import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum, LanguageCodeEnum, LANGUAGES} from '@utility/domain/enum';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {IMember} from "@member/domain";
import {IDurationVersion} from "@service/domain";
import {SchedulesForm} from "@utility/presentation/form/schdeule.form";

export const MINUTE_15 = 900; // In seconds
export const MINUTE_45 = 2700; // In seconds

export const STR_MINUTE_15 = '00:15:00'; // In seconds
export const STR_MINUTE_45 = '00:45:00'; // In seconds

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

  // preferredLanguages: FormControl<LanguageCodeEnum[]>;

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
  break: FormControl<string>;
  duration: FormControl<string>;
  prices: PricesForm;

  [key: string]: AbstractControl<any, any>;
}

export class DurationVersionForm extends FormGroup<IDurationVersionForm> {
  constructor() {
    super({
      break: new FormControl(),
      duration: new FormControl(),
      prices: new PricesForm(),
    });
    this.initValue();
  }

  public initValue(): void {
    this.controls.break.setValue(STR_MINUTE_15);
    this.controls.duration.setValue(STR_MINUTE_45);
  }

}

export class PricesForm extends FormArray<PriceForm> {
  constructor() {
    super([]);
    this.pushNewPriceForm();
  }

  public pushNewPriceForm(): void {
    this.controls.push(new PriceForm());
  }

  public remove(index: number): void {
    this.controls.splice(index, 1);
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


// export interface IPresentationForm {
//   main: FormControl<string>;
//
//   [key: string]: AbstractControl<any, any>;
// }
//
// export class PresentationForm extends FormGroup<IPresentationForm> {
//   constructor() {
//     super({
//       main: new FormControl(),
//     });
//   }
// }

export class LanguageVersionsForm extends FormArray<LanguageVersionForm> {
  constructor() {
    super([new LanguageVersionForm()]);
  }

  public remove(index: number): void {
    this.controls.splice(index, 1);
  }

}

export class DurationVersionsForm extends FormArray<DurationVersionForm> {
  constructor() {
    super([new DurationVersionForm()]);
  }

  public remove(index: number): void {
    this.controls.splice(index, 1);
  }

  public removeControls(): void {
    this.controls = [];
  }

  public pushNewOne(initialValue?: undefined | IDurationVersion): void {
    const newOne = new DurationVersionForm();
    if (initialValue) {
      newOne.patchValue(initialValue);
    }
    this.controls.push(newOne);
  }

}

export interface IServiceForm {
  // presentation: PresentationForm;
  schedules: SchedulesForm;
  configuration: ConfigurationForm;
  prepaymentPolicy: PrepaymentPolicyForm;
  languageVersions: LanguageVersionsForm;
  durationVersions: DurationVersionsForm;
  _id: FormControl<string>;
  permanentMembers: FormControl<IMember[]>;
  active: FormControl<ActiveEnum>;
  createdAt: FormControl<string>;
  updatedAt: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export class ServiceForm extends FormGroup<IServiceForm> {
  constructor() {
    super({
      // presentation: new PresentationForm(),
      schedules: new SchedulesForm(),
      configuration: new ConfigurationForm(),
      prepaymentPolicy: new PrepaymentPolicyForm(),
      languageVersions: new LanguageVersionsForm(),
      durationVersions: new DurationVersionsForm(),
      permanentMembers: new FormControl(),
      active: new FormControl(),
      _id: new FormControl(),
      createdAt: new FormControl(),
      updatedAt: new FormControl(),
    });
    this.initValue();
  }

  public initValue(): void {
    this.controls.permanentMembers.setValue([]);
    this.controls.active.setValue(ActiveEnum.YES);
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
