import {inject, Injectable} from "@angular/core";
import {CreateBusinessFormRepository} from "@identity/repository/create-business.form.repository";

@Injectable({
	providedIn: 'root',
})
export class CreateBusinessQuery {

	private readonly createBusinessFormRepository = inject(CreateBusinessFormRepository);

	public getBusinessNameControl() {
		return this.createBusinessFormRepository.form.controls.businessName;
	}

	public getBusinessCategoryControl() {
		return this.createBusinessFormRepository.form.controls.businessCategory;
	}

	public getBusinessIndustryControl() {
		return this.createBusinessFormRepository.form.controls.businessIndustry;
	}

	public getServiceProvideTypeControl() {
		return this.createBusinessFormRepository.form.controls.serviceProvideType;
	}

	public getBusinessOwnerForm() {
		return this.createBusinessFormRepository.form.controls.businessOwner;
	}

	public getAddressForm() {
		return this.createBusinessFormRepository.form.controls.addressForm;
	}

	public getGalleryForm() {
		return this.createBusinessFormRepository.form.controls.gallery;
	}

	public getServicesForm() {
		return this.createBusinessFormRepository.form.controls.services;
	}

	public getSchedulesForm() {
		return this.createBusinessFormRepository.form.controls.schedules;
	}

	public initForm(): void {
		this.createBusinessFormRepository.initForm();
	}

}
