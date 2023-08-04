import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";
import {IAttendee} from "@event/domain";
import {CustomerForm} from "@customer/form";
import {IsNewCustomerEnum, IsOptionalEnum, IsOrganizerEnum} from "@utility/domain/enum";


export interface IAttendantForm {
  _id: FormControl<string>;
  isOptional: FormControl<IsOptionalEnum>;
  isOrganizer: FormControl<IsOrganizerEnum>;
  isNewCustomer: FormControl<IsNewCustomerEnum>;
  customer: CustomerForm;

  [key: string]: AbstractControl<any, any>;
}

export class AttendantForm extends FormGroup<IAttendantForm> {
  constructor() {
    super({
      _id: new FormControl(),
      isOptional: new FormControl(),
      isOrganizer: new FormControl(),
      isNewCustomer: new FormControl(),
      customer: new CustomerForm()
    });
    this.initValue();
  }

  public toggleIsNewCustomer(): void {
    if (this.controls.isNewCustomer.value === IsNewCustomerEnum.YES) {
      this.controls.isNewCustomer.patchValue(IsNewCustomerEnum.NO);
    } else {
      this.controls.isNewCustomer.patchValue(IsNewCustomerEnum.YES);
    }
  }

  public initValue(): void {
    this.controls.isNewCustomer.patchValue(IsNewCustomerEnum.NO);
    this.controls.isOrganizer.patchValue(IsOrganizerEnum.NO);
    this.controls.isOptional.patchValue(IsOptionalEnum.NO);
  }
}



export class AttendeesForm extends FormArray<AttendantForm> {

  constructor() {
    super([new AttendantForm()]);
  }

  public pushNewOne(initialValue?: IAttendee | undefined): void {
    const control = new AttendantForm();
    if (initialValue) {
      control.patchValue(initialValue);
      // control.controls.customer.patchValue(initialValue.customer);
    }
    this.controls.push(control);
    this.updateValueAndValidity();
  }

  public remove(index: number): void {
    this.controls.splice(index, 1);
  }

}
