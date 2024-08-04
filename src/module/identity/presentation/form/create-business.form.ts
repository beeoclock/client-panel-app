import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AddressForm, BookingSettingsForm, GalleryForm} from "@client/presentation/form";
import {SchedulesForm} from "@utility/presentation/form/schdeule.form";
import {ServiceForm, ServicesForm} from "@service/presentation/form";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {BusinessIndustryEnum} from "@utility/domain/enum/business-industry.enum";
import {ActiveEnum} from "@utility/domain/enum";
import {DefaultServicesByBusinessCategory} from "@utility/domain/const/c.default-services-by-business-category";
import {BusinessSettingsForm} from "@client/presentation/form/business-settings.form";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

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

	businessCategory: FormControl<BusinessCategoryEnum>;
	serviceProvideType: FormControl<ServiceProvideTypeEnum>;
	businessIndustry: FormControl<BusinessIndustryEnum>;
	businessName: FormControl<string>;
	published: FormControl<ActiveEnum>;
	businessOwner: BusinessOwnerForm;
}

export default class CreateBusinessForm extends FormGroup<IBusinessClientForm> {

	private readonly destroy$ = new Subject<void>();

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

			businessCategory: new FormControl(),
			businessIndustry: new FormControl(),
			serviceProvideType: new FormControl(),
			businessName: new FormControl(),
			published: new FormControl(ActiveEnum.YES, {
				nonNullable: true,
			}),
			businessOwner: new BusinessOwnerForm(),
		});
		this.initValidators();
		this.initHandlers();
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

		this.controls.businessIndustry.updateValueAndValidity();

	}

	private initHandlers(): void {
		this.initBusinessCategoryHandler();
	}

	private initBusinessCategoryHandler() {
		this.controls.businessCategory.valueChanges.pipe(
			takeUntil(this.destroy$)
		).subscribe(() => {
			this.fillServices();
		})
	}

	private fillServices(): void {

		this.controls.services.clear();

		const businessCategory = this.controls.businessCategory.value as BusinessCategoryEnum;
		const servicesByLanguage = DefaultServicesByBusinessCategory[this.controls.businessSettings.controls.baseLanguage.value];

		if (!servicesByLanguage) {
			return;
		}

		const servicesByBusinessCategory = servicesByLanguage[businessCategory];

		if (!servicesByBusinessCategory) {
			return;
		}

		servicesByBusinessCategory.forEach(({
																					title,
																					durationVersions,
																				}) => {
			const form = new ServiceForm();
			form.controls.languageVersions.at(0).controls.title.setValue(title);

			form.controls.durationVersions.clear();

			durationVersions.forEach(({
																	durationInSeconds,
																	price,
																	currency,
																}) => {
				form.controls.durationVersions.pushNewOne({
					breakInSeconds: 0,
					durationInSeconds,
					prices: [
						{
							price,
							currency,
						}
					]
				});
			});

			this.controls.services.push(form);
		});


	}

	public destroyHandlers(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
