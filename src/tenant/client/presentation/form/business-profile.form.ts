import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum} from '@core/shared/enum/active.enum';
import {SocialNetworksForm} from "@tenant/client/presentation/form/social-network.form";
import {FacilityEnum} from "@core/shared/enum/facility.enum";
import {BookingSettingsForm} from "@tenant/client/presentation/form/booking-settings.form";
import {AddressesForm} from "@tenant/client/presentation/form/address.form";
import {SchedulesForm} from "@shared/presentation/form/schdeule.form";
import {ContactsForm} from "@tenant/client/presentation/form/contact.form";
import {BusinessSettingsForm} from "@tenant/client/presentation/form/business-settings.form";
import {is} from "@core/shared/checker";
import {USERNAME_ANGULAR_VALIDATOR} from "@shared/validation/validators";
import {takeUntil} from "rxjs/operators";
import {Subject} from 'rxjs';
import {SendNotificationConditionEnum} from "@core/shared/enum/send-notification-condition.enum";
import {PublicPageSettings} from "@tenant/client/presentation/form/public-page-settings.form";


export interface IBusinessProfileForm {
	_id: FormControl<string>;
	object: FormControl<'BusinessProfileDto'>;

	name: FormControl<string>;
	username: FormControl<string | null>;
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
		this.controls.username.setValidators([USERNAME_ANGULAR_VALIDATOR()]);
	}

	// public async setLogo(target: HTMLInputElement): Promise<void> {
	//   const base64 = await file2base64(extractFile(target));
	//   this.controls.logo.patchValue(base64);
	// }
}
