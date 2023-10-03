import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AddressForm, GalleryForm} from "@client/presentation/form";
import {SchedulesForm} from "@utility/presentation/form/schdeule.form";
import {ServiceForm, ServicesForm} from "@service/presentation/form";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {BusinessIndustryEnum} from "@utility/domain/enum/business-industry.enum";
import {inject} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {LanguageCodeEnum} from "@utility/domain/enum";
import {DefaultServicesByBusinessCategory} from "@utility/domain/const/c.default-services-by-business-category";


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

	[key: string]: AbstractControl;
}

export default class CreateBusinessForm extends FormGroup<IBusinessClientForm> {

	private readonly translateService = inject(TranslateService);

	constructor() {
		super({
			addressForm: new AddressForm(),
			schedules: new SchedulesForm(),
			gallery: new GalleryForm(),
			services: new ServicesForm([]),

			businessCategory: new FormControl(),
			businessIndustry: new FormControl(),
			serviceProvideType: new FormControl(),
			businessName: new FormControl(),
			businessOwnerFullName: new FormControl(),
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

		this.controls.businessOwnerFullName.setValidators([
			Validators.required
		]);
		this.controls.businessIndustry.updateValueAndValidity();

	}

	private initHandlers(): void {
		this.initBusinessCategoryHandler();
	}

	private initBusinessCategoryHandler() {
		this.controls.businessCategory.valueChanges.subscribe(() => {
			this.fillServices();
		})
	}

	private fillServices(): void {

		this.controls.services.clear();

		const currentLang = this.translateService.currentLang as LanguageCodeEnum;
		const businessCategory = this.controls.businessCategory.value as BusinessCategoryEnum;
		const servicesByLanguage = DefaultServicesByBusinessCategory[currentLang];

		if (!servicesByLanguage) {
			return;
		}

		const servicesByBusinessCategory = servicesByLanguage[businessCategory];

		if (!servicesByBusinessCategory) {
			return;
		}

		servicesByBusinessCategory.forEach(({
																					title,
																					durationInSeconds,
																					price,
																					currency
																				}) => {
			const form = new ServiceForm();
			form.controls.languageVersions.at(0).controls.title.setValue(title);
			form.controls.durationVersions.at(0).controls.durationInSeconds.setValue(durationInSeconds);
			form.controls.durationVersions.at(0).controls.prices.at(0).controls.price.setValue(price);
			form.controls.durationVersions.at(0).controls.prices.at(0).controls.currency.setValue(currency);
			this.controls.services.push(form);
		});


	}
}
