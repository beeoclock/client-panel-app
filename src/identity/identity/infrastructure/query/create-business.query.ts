import {inject, Injectable} from "@angular/core";
import {
	CreateBusinessFormRepository
} from "@identity/identity/infrastructure/repository/create-business.form.repository";

@Injectable()
export class CreateBusinessQuery {

	private readonly createBusinessFormRepository = inject(CreateBusinessFormRepository);

	public getBusinessNameControl() {
		return this.createBusinessFormRepository.form.controls.businessName;
	}

	public getBookingSettingsControl() {
		return this.createBusinessFormRepository.form.controls.bookingSettings;
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

	public getBusinessSettings() {
		return this.createBusinessFormRepository.form.controls.businessSettings;
	}

	public publishedControl() {
		return this.createBusinessFormRepository.form.controls.published;
	}

	public initForm(): void {
		this.createBusinessFormRepository.initForm();
	}

}
