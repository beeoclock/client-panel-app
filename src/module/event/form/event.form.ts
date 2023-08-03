import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {IService} from "@service/domain";
import {ICustomer} from "@customer/domain";


export interface IAttendantForm {
  _id: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export interface IEventForm {
  _id: FormControl<string>;
  servicesAreProvidedInParallel: FormControl<boolean>;
  services: FormControl<IService[]>;
  description: FormControl<string>;
  start: FormControl<string>;
  end: FormControl<string>;
  timeZone: FormControl<string>;
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
      timeZone: new FormControl(),
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
    this.controls.services.patchValue([]);
    this.controls.servicesAreProvidedInParallel.patchValue(false);
    this.controls.end.patchValue(new Date().toISOString());
    this.controls.start.patchValue(new Date().toISOString());
    this.controls.timeZone.patchValue(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }

}

export class AttendeesForm extends FormArray<AttendantForm> {

  constructor() {
    super([new AttendantForm()]);
  }

  public pushNewOne(initialValue?: ICustomer | undefined): void {
    const control = new AttendantForm();
    if (initialValue) {
      control.patchValue(initialValue);
    }
    this.controls.push(control);
  }

  public remove(index: number): void {
    this.controls.splice(index, 1);
  }

}

export class AttendantForm extends FormGroup<IAttendantForm> {
  constructor() {
    super({
      _id: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
    });
    this.initValidators();
  }

  public initValidators(): void {
    this.controls.email.setValidators([Validators.email]);
  }
}
