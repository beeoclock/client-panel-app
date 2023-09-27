import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AddressForm, GalleryForm} from "@client/presentation/form";
import {SchedulesForm} from "@utility/presentation/form/schdeule.form";
import {ServicesForm} from "@service/presentation/form";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {BusinessIndustryEnum} from "@utility/domain/enum/business-industry.enum";


interface IBusinessClientForm {
	addressForm: AddressForm;
	schedules: SchedulesForm;
	gallery: GalleryForm;
	services: ServicesForm;

	businessCategory: FormControl<BusinessCategoryEnum>;
	serviceProvideType: FormControl<ServiceProvideTypeEnum>;
	businessIndustry: FormControl<BusinessIndustryEnum>;
	businessName: FormControl<string>;
	businessOwnerFullName: FormControl<string>;

	[key: string]: AbstractControl<any, any>;
}

export default class CreateBusinessForm extends FormGroup<IBusinessClientForm> {
	constructor() {
		super({
			addressForm: new AddressForm(),
			schedules: new SchedulesForm(),
			gallery: new GalleryForm(),
			services: new ServicesForm(),

			businessCategory: new FormControl(),
			businessIndustry: new FormControl(),
			serviceProvideType: new FormControl(),
			businessName: new FormControl(),
			businessOwnerFullName: new FormControl(),
		});
		this.initValidators();
	}

	public initValidators(): void {

		this.controls.businessIndustry.setValidators([
			Validators.required
		]);
		this.controls.businessIndustry.updateValueAndValidity();

		this.controls.businessName.setValidators([
			Validators.required
		]);
		this.controls.businessIndustry.updateValueAndValidity();

		this.controls.businessOwnerFullName.setValidators([
			Validators.required
		]);
		this.controls.businessIndustry.updateValueAndValidity();

	}
}
