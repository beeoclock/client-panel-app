import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {EarliestBookingEnum} from "@utility/domain/enum/earliest-booking.enum";
import {LatestBookingEnum} from "@utility/domain/enum/latest-booking.enum";
import {ApprovalTimeEnum} from "@utility/domain/enum/approval-time.enum";

export interface IBookingSettingsForm {

  object: FormControl<'BookingSettings'>;
  approvalTime: FormControl<ApprovalTimeEnum>;
  latestBooking: FormControl<LatestBookingEnum>;
  earliestBooking: FormControl<EarliestBookingEnum>;

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
    this.controls.earliestBooking.setValue(EarliestBookingEnum.ONE_DAY);
    this.controls.latestBooking.setValue(LatestBookingEnum.TWO_WEEKS);
    this.controls.approvalTime.setValue(ApprovalTimeEnum.ONE_HOUR);
  }

  private initValidators(): void {
    this.controls.approvalTime.setValidators(Validators.required);
    this.controls.latestBooking.setValidators(Validators.required);
    this.controls.earliestBooking.setValidators(Validators.required);
  }

}
