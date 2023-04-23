import {AbstractControl, FormArray, FormControl, FormGroup, Validators, ɵFormGroupValue} from '@angular/forms';
import {LanguageCodeEnum, LANGUAGES} from '@utility/domain/enum';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {WeekDaysEnum, WORK_WEEK} from '@utility/domain/enum/days-of-week.enum';
import {ActiveEnum} from '@utility/domain/enum/active.enum';


export interface ILanguageVersionForm {
  title: FormControl<string>;
  description: FormControl<string>;
  language: FormControl<LanguageCodeEnum>;

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
    });
    this.initValidators();
    this.initValue();
  }

  public initValidators(): void {
    this.controls.title.setValidators([Validators.required]);
    this.controls.language.setValidators([Validators.required]);
  }

  public initValue(): void {
    this.controls.language.patchValue(this.language);
  }
}

export interface IPriceForm {
  price: FormControl<number>;
  currency: FormControl<CurrencyCodeEnum>;
  preferredLanguages: FormControl<LanguageCodeEnum[]>;

  [key: string]: AbstractControl<any, any>;
}

export class PriceForm extends FormGroup<IPriceForm> {
  constructor() {
    super({
      price: new FormControl(),
      currency: new FormControl(),
      preferredLanguages: new FormControl(),
    });
    this.initValue();
  }

  public initValue(): void {
    this.controls.preferredLanguages.setValue([LanguageCodeEnum.en]);
    this.controls.currency.setValue(CurrencyCodeEnum.USD);
  }
}

export interface IDurationVersionForm {
  break: FormControl<number>;
  duration: FormControl<number>;
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
    this.controls.break.setValue(15);
    this.controls.duration.setValue(45);
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
  isRequired: FormControl<string>;
  isPercentage: FormControl<string>;
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

export interface IScheduleForm {
  workDays: FormControl<WeekDaysEnum[]>;
  startTime: FormControl<string>;
  endTime: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export class ScheduleForm extends FormGroup<IScheduleForm> {
  constructor() {
    super({
      workDays: new FormControl(),
      startTime: new FormControl(),
      endTime: new FormControl(),
    });
    this.initValue();
  }

  public initValue(): void {
    this.controls.workDays.setValue(WORK_WEEK);
    this.controls.startTime.setValue('08:00');
    this.controls.endTime.setValue('18:00');
  }
}

export type ILanguageVersionsForm = {
  [key in keyof typeof LanguageCodeEnum]?: LanguageVersionForm;
};

export class LanguageVersionsForm extends FormGroup<ILanguageVersionsForm> {
  constructor() {
    super({
      [LanguageCodeEnum.en]: new LanguageVersionForm(),
    });
  }
}

export interface IServiceForm {
  schedules: FormArray<ScheduleForm>;
  configuration: ConfigurationForm;
  prepaymentPolicy: PrepaymentPolicyForm;
  languageVersions: LanguageVersionsForm;
  durationVersions: FormArray<DurationVersionForm>;
  id: FormControl<string>;
  active: FormControl<ActiveEnum>;
  createdAt: FormControl<string>;
  updatedAt: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export class ServiceForm extends FormGroup<IServiceForm> {
  constructor() {
    super({
      schedules: new FormArray([new ScheduleForm()]),
      configuration: new ConfigurationForm(),
      prepaymentPolicy: new PrepaymentPolicyForm(),
      languageVersions: new LanguageVersionsForm(),
      durationVersions: new FormArray([new DurationVersionForm()]),
      active: new FormControl(),
      id: new FormControl(),
      createdAt: new FormControl(),
      updatedAt: new FormControl(),
    });
    this.initValue();
  }

  public initValue(): void {
    this.controls.active.setValue(ActiveEnum.YES);
    this.controls.createdAt.setValue(new Date().toISOString());
    this.controls.updatedAt.setValue(new Date().toISOString());
  }

  public pushNewScheduleForm(): void {
    this.controls.schedules.push(new ScheduleForm());
  }

  public pushNewDurationVersionForm(): void {
    this.controls.durationVersions.push(new DurationVersionForm());
  }

  public pushNewLanguageVersionForm(): void {
    for (const language of LANGUAGES) {
      if (language.code in this.controls.languageVersions.controls) {
        continue;
      }
      this.addNewLanguageVersionControl(language.code);
      break;
    }
  }

  public addNewLanguageVersionControl(languageCode: LanguageCodeEnum): void {
    this.controls.languageVersions.addControl(languageCode, new LanguageVersionForm(languageCode));
  }

  public override patchValue(
    value: ɵFormGroupValue<IServiceForm>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void {
    Object.keys(value.languageVersions ?? {}).forEach((key: string) => {
      this.addNewLanguageVersionControl(key as LanguageCodeEnum);
    });
    super.patchValue(value, options);
  }

}
