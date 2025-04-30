import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SchedulesForm} from "@shared/presentation/form/schdeule.form";
import {ServicesForm} from "@tenant/service/presentation/form";
import {ActiveEnum} from "@core/shared/enum";
import {BusinessSettingsForm} from "@tenant/client/presentation/form/business-settings.form";
import {AddressForm, BookingSettingsForm, GalleryForm} from "@tenant/client/presentation/form";

interface IBusinessOwnerForm {
	firstName: FormControl<string>;
	lastName: FormControl<string>;
}

export class BusinessOwnerForm extends FormGroup<IBusinessOwnerForm> {
	constructor() {
		super({
			firstName: new FormControl(),
			lastName: new FormControl()
		});
		this.initValidation();
	}

	private initValidation(): void {
		this.controls.firstName.setValidators([Validators.required]);
		this.controls.lastName.setValidators([Validators.required]);
	}

}

interface IBusinessClientForm {
	addressForm: AddressForm;
	schedules: SchedulesForm;
	gallery: GalleryForm;
	services: ServicesForm;
	businessSettings: BusinessSettingsForm;
	bookingSettings: BookingSettingsForm;

	businessName: FormControl<string>;
	published: FormControl<ActiveEnum>;
	businessOwner: BusinessOwnerForm;
}

export default class CreateBusinessForm extends FormGroup<IBusinessClientForm> {

	constructor() {
		super({
			addressForm: new AddressForm({
				initValidation: false,
			}),
			schedules: new SchedulesForm(),
			gallery: new GalleryForm(),
			businessSettings: new BusinessSettingsForm(),
			bookingSettings: new BookingSettingsForm(),
			services: new ServicesForm([]),

			businessName: new FormControl(),
			published: new FormControl(ActiveEnum.YES, {
				nonNullable: true,
			}),
			businessOwner: new BusinessOwnerForm(),
		});
		this.initValidators();
	}

	public initValidators(): void {

		this.controls.businessName.setValidators([
			Validators.required
		]);

	}

}
