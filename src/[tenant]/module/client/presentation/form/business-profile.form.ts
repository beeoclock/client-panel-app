import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum} from '@core/shared/enum/active.enum';
import {SocialNetworksForm} from "@client/presentation/form/social-network.form";
import {FacilityEnum} from "@core/shared/enum/facility.enum";
import {BookingSettingsForm} from "@client/presentation/form/booking-settings.form";
import {AddressesForm} from "@client/presentation/form/address.form";
import {SchedulesForm} from "@utility/presentation/form/schdeule.form";
import {ContactsForm} from "@client/presentation/form/contact.form";
import {BusinessCategoryEnum} from "@core/shared/enum/business-category.enum";
import {BusinessIndustry} from "@utility/domain/business-industry";
import {ServiceProvideTypeEnum} from "@core/shared/enum/service-provide-type.enum";
import {BusinessSettingsForm} from "@client/presentation/form/business-settings.form";
import {is} from "@core/shared/checker";
import {USERNAME_ANGULAR_VALIDATOR} from "@utility/validation/validators";
import {takeUntil} from "rxjs/operators";
import {Subject} from 'rxjs';
import {SendNotificationConditionEnum} from "@core/shared/enum/send-notification-condition.enum";
import {PublicPageSettings} from "@client/presentation/form/public-page-settings.form";


export interface IBusinessProfileForm {
	_id: FormControl<string>;
	object: FormControl<'BusinessProfileDto'>;

	name: FormControl<string>;
	username: FormControl<string | null>;
	businessCategory: FormControl<BusinessCategoryEnum>;
	businessIndustry: FormControl<BusinessIndustry>;
	serviceProvideType: FormControl<ServiceProvideTypeEnum | null>;
	feature: FormControl<string>;
	description: FormControl<string>;
	published: FormControl<ActiveEnum>;

	socialNetworkLinks: SocialNetworksForm;

	publicPageSettings: PublicPageSettings;
	bookingSettings: BookingSettingsForm;
	businessSettings: BusinessSettingsForm;
	notificationSettings: NotificationSettingsFromGroup;
	addresses: AddressesForm;
	schedules: SchedulesForm;
	contacts: ContactsForm;
	facilities: FormControl<FacilityEnum[]>;
}

export type NotificationSettingsFromGroup = FormGroup<{
	emailNotificationSettings: FormGroup<{ sendNotificationConditionType: FormControl<SendNotificationConditionEnum> }>;
	smsNotificationSettings: FormGroup<{ sendNotificationConditionType: FormControl<SendNotificationConditionEnum> }>;
}>;

export class BusinessProfileForm extends FormGroup<IBusinessProfileForm> {

	private readonly destroy$ = new Subject<void>();

	constructor() {
		super({
			_id: new FormControl(),
			object: new FormControl('BusinessProfileDto', {
				nonNullable: true,
			}),
			name: new FormControl(),
			username: new FormControl(),
			notificationSettings: new FormGroup({
				emailNotificationSettings: new FormGroup({sendNotificationConditionType: new FormControl()}),
				smsNotificationSettings: new FormGroup({sendNotificationConditionType: new FormControl()}),
			}),
			businessCategory: new FormControl(),
			businessIndustry: new FormControl(),
			serviceProvideType: new FormControl(),
			feature: new FormControl(),
			description: new FormControl(),
			published: new FormControl(),
			socialNetworkLinks: new SocialNetworksForm(),

			publicPageSettings: new PublicPageSettings(),
			bookingSettings: new BookingSettingsForm(),
			businessSettings: new BusinessSettingsForm(),
			facilities: new FormControl(),
			addresses: new AddressesForm(),
			schedules: new SchedulesForm(),
			contacts: new ContactsForm()
		});

		this.initValidators();
		this.initHandles();
		this.initValue();

	}

	private initHandles(): void {
		this.controls.published.valueChanges.pipe(
			takeUntil(this.destroy$)
		).subscribe((value) => {
			if (is.boolean(value)) {
				this.controls.published.patchValue(+value, {
					emitEvent: false
				});
			}
		})
	}

	public destroyHandlers(): void {

		this.destroy$.next();
		this.destroy$.complete();

	}

	private initValue(): void {
		this.controls.published.setValue(ActiveEnum.NO);
	}

	private initValidators(): void {
		this.controls.name.setValidators([Validators.minLength(1), Validators.required]);
		this.controls.description.setValidators([Validators.maxLength(1000)]);
		this.controls.businessCategory.setValidators([Validators.required]);
		this.controls.username.setValidators([USERNAME_ANGULAR_VALIDATOR()]);
	}

	// public async setLogo(target: HTMLInputElement): Promise<void> {
	//   const base64 = await file2base64(extractFile(target));
	//   this.controls.logo.patchValue(base64);
	// }
}
