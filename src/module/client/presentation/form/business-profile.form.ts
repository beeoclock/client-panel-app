import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {SocialNetworksForm} from "@client/presentation/form/social-network.form";
import {FacilityEnum} from "@utility/domain/enum/facility.enum";
import {BookingSettingsForm} from "@client/presentation/form/booking-settings.form";
import {AddressesForm} from "@client/presentation/form/address.form";
import {SchedulesForm} from "@utility/presentation/form/schdeule.form";
import {ContactsForm} from "@client/presentation/form/contact.form";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";
import {BusinessIndustry} from "@utility/domain/business-industry";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {BusinessSettingsForm} from "@client/presentation/form/business-settings.form";
import {is} from "thiis";


export interface IBusinessProfile {
	_id: FormControl<string>;
	object: FormControl<'Client'>;

	name: FormControl<string>;
	businessCategory: FormControl<BusinessCategoryEnum>;
	businessIndustry: FormControl<BusinessIndustry>;
	serviceProvideType: FormControl<ServiceProvideTypeEnum>;
	feature: FormControl<string>;
	description: FormControl<string>;
	published: FormControl<ActiveEnum>;

	socialNetworkLinks: SocialNetworksForm;

	bookingSettings: BookingSettingsForm;
	businessSettings: BusinessSettingsForm;
	addresses: AddressesForm;
	schedules: SchedulesForm;
	contacts: ContactsForm;
	facilities: FormControl<FacilityEnum[]>;
}

export class BusinessProfileForm extends FormGroup<IBusinessProfile> {

	constructor() {
		super({
			_id: new FormControl(),
			object: new FormControl(),
			name: new FormControl(),
			businessCategory: new FormControl(),
			businessIndustry: new FormControl(),
			serviceProvideType: new FormControl(),
			feature: new FormControl(),
			description: new FormControl(),
			published: new FormControl(),
			socialNetworkLinks: new SocialNetworksForm(),

			bookingSettings: new BookingSettingsForm(),
			businessSettings: new BusinessSettingsForm(),
			facilities: new FormControl(),
			addresses: new AddressesForm(),
			schedules: new SchedulesForm(),
			contacts: new ContactsForm(),
		});

		this.initValidators();
		this.initHandles();
		this.initValue();

	}

	private initHandles(): void {
		this.controls.published.valueChanges.subscribe((value) => {
			if (is.boolean(value)) {
				this.controls.published.patchValue(+value, {
					emitEvent: false
				});
			}
		})
	}

	private initValue(): void {
		this.controls.object.setValue('Client');
		this.controls.published.setValue(ActiveEnum.NO);
	}

	private initValidators(): void {
		this.controls.name.setValidators([Validators.minLength(1), Validators.required]);
		this.controls.description.setValidators([Validators.maxLength(1000)]);
		this.controls.businessCategory.setValidators([Validators.required]);
	}

	// public async setLogo(target: HTMLInputElement): Promise<void> {
	//   const base64 = await file2base64(extractFile(target));
	//   this.controls.logo.patchValue(base64);
	// }
}
