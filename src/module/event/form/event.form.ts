import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {IService} from "@service/domain";


export interface IAttendantForm {
  email: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export interface IEventForm {
  _id: FormControl<string>;
  servicesAreProvidedInParallel: FormControl<boolean>;
  services: FormControl<IService[]>;
  description: FormControl<string>;
  start: FormControl<string>;
  end: FormControl<string>;
  attendees: AttendeesForm;

  [key: string]: AbstractControl<any, any>;
}

export class EventForm extends FormGroup<IEventForm> {

  constructor() {
    super({
      _id: new FormControl(),
      description: new FormControl(),
      end: new FormControl(),
      start: new FormControl(),
      servicesAreProvidedInParallel: new FormControl(),
      services: new FormControl(),
      attendees: new AttendeesForm(),
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
    this.controls.servicesAreProvidedInParallel.patchValue(false);
    this.controls.end.patchValue(new Date().toISOString());
    this.controls.start.patchValue(new Date().toISOString());
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
