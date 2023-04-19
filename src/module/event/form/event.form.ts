import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import * as Utility from '@utility/domain';


export interface IAttendeesForm {
  email: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export interface IEventForm {
  id: FormControl<string>;
  title: FormControl<string>;
  services: FormControl<string[]>;
  description: FormControl<string>;
  start: FormControl<string>;
  end: FormControl<string>;
  attendees: FormArray<AttendeesForm>;
  languageCodes: FormControl<Utility.Enum.LanguageCodeEnum[]>;

  [key: string]: AbstractControl<any, any>;
}

export class EventForm extends FormGroup<IEventForm> {

  public readonly languages: {
    code: Utility.Enum.LanguageCodeEnum;
    name: string;
  }[] = [
    {
      code: Utility.Enum.LanguageCodeEnum.en,
      name: 'English'
    },
    {
      code: Utility.Enum.LanguageCodeEnum.uk,
      name: 'Українська'
    },
    {
      code: Utility.Enum.LanguageCodeEnum.pl,
      name: 'Polski'
    },
  ];

  constructor() {
    super({
      id: new FormControl(),
      description: new FormControl(),
      end: new FormControl(),
      start: new FormControl(),
      services: new FormControl(),
      title: new FormControl(),
      attendees: new FormArray<AttendeesForm>([]),
      languageCodes: new FormControl()
    });
    this.initValidators();
    this.initValue();
  }

  public initValidators(): void {
    this.controls.start.setValidators([Validators.required]);
    this.controls.end.setValidators([Validators.required]);
    this.controls.attendees.setValidators([Validators.minLength(1)]);
  }

  public initValue(): void {
    this.controls.end.patchValue(new Date().toISOString());
    this.controls.start.patchValue(new Date().toISOString());

    this.controls.languageCodes.patchValue([Utility.Enum.LanguageCodeEnum.en]);

    this.controls.attendees.push(new AttendeesForm());
  }

}

export class AttendeesForm extends FormGroup<IAttendeesForm> {
  constructor() {
    super({
      email: new FormControl(),
    });
    this.initValidators();
  }
  public initValidators(): void {
    this.controls.email.setValidators([Validators.required, Validators.email]);
  }
}
