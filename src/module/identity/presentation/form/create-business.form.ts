import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AddressForm, GalleryForm} from "@client/presentation/form";
import {SchedulesForm} from "@utility/presentation/form/schdeule.form";
import {ServicesForm} from "@service/presentation/form";


interface IBusinessClientForm {
	addressForm: AddressForm;
	schedules: SchedulesForm;
	gallery: GalleryForm;
	services: ServicesForm;


	businessCategory: FormControl<string>;
	businessName: FormControl<string>;
	businessOwnerFullName: FormControl<string>;

	[key: string]: AbstractControl<any, any>;
}

export default class CreateBusinessForm extends FormGroup<IBusinessClientForm> {
	constructor() {
		super({
			addressForm: new AddressForm,
			schedules: new SchedulesForm,
			gallery: new GalleryForm,
			services: new ServicesForm(),

			businessCategory: new FormControl(),
			businessName: new FormControl(),
			businessOwnerFullName: new FormControl(),
		});
		this.initValidators();
	}

	public initValidators(): void {
		this.controls.businessCategory.setValidators([
			Validators.required
		]);
		this.controls.businessName.setValidators([
			Validators.required
		]);
		this.controls.businessOwnerFullName.setValidators([
			Validators.required
		]);
	}
}
