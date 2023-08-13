import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

export interface IBookingSettingsForm {

  object: FormControl<'BookingSettings'>;
  approvalTime: FormControl<number>;
  latestBooking: FormControl<number>;
  earliestBooking: FormControl<number>;

  [key: string]: AbstractControl<any, any>;
}

export class BookingSettingsForm extends FormGroup<IBookingSettingsForm> {

  constructor() {
    super({
      object: new FormControl(),
      approvalTime: new FormControl(),
      latestBooking: new FormControl(),
      earliestBooking: new FormControl(),
    });

    this.initValue();
    this.initValidators();

  }

  private initValue(): void {
    this.controls.object.setValue('BookingSettings');
  }

  private initValidators(): void {
    this.controls.approvalTime.setValidators(Validators.required);
    this.controls.latestBooking.setValidators(Validators.required);
    this.controls.earliestBooking.setValidators(Validators.required);
  }

}
