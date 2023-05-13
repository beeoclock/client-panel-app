import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import * as Utility from '@utility/domain';
import {IService} from "@service/domain";


export interface IAttendantForm {
  email: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export interface IEventForm {
  _id: FormControl<string>;
  title: FormControl<string>;
  services: FormControl<IService[]>;
  description: FormControl<string>;
  start: FormControl<string>;
  end: FormControl<string>;
  attendees: AttendeesForm;
  languageCodes: FormControl<Utility.Enum.LanguageCodeEnum[]>;

  [key: string]: AbstractControl<any, any>;
}

export class EventForm extends FormGroup<IEventForm> {

  constructor() {
    super({
      _id: new FormControl(),
      description: new FormControl(),
      end: new FormControl(),
      start: new FormControl(),
      services: new FormControl(),
      title: new FormControl(),
      attendees: new AttendeesForm(),
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
  }

}

export class AttendeesForm extends FormArray<AttendantForm> {

  constructor() {
    super([new AttendantForm()]);
  }

  public pushNewAttendant(): void {
    this.controls.push(new AttendantForm());
  }

  public remove(index: number): void {
    this.controls.splice(index, 1);
  }

}

export class AttendantForm extends FormGroup<IAttendantForm> {
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
