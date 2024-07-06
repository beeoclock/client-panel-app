import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {ServiceItemComponent} from "@service/presentation/component/list/item/item.componen";
import {NgForOf} from "@angular/common";
import {IService} from "@service/domain";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormButtonWithIconComponent} from "@utility/presentation/component/button/form-button-with-icon.component";
import {ScheduleFormComponent} from "@utility/presentation/component/schedule/schedule.form.component";
import {
	CreateBusinessModalService
} from "@service/presentation/component/form/modal/create-business/create-business.modal.service";
import {ServiceForm} from "@service/presentation/form";
import {NGXLogger} from "ngx-logger";
import {CurrencyCodeEnum, LanguageCodeEnum} from "@utility/domain/enum";


@Component({
	selector: 'app-services-create-business-identity-page',
	templateUrl: './services.create-business.identity.page.html',
	standalone: true,
	imports: [
		RouterLink,
		PrimaryLinkButtonDirective,
		FormInputComponent,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		TranslateModule,
		ServiceItemComponent,
		NgForOf,
		CardComponent,
		FormButtonWithIconComponent,
		ScheduleFormComponent
	],
	encapsulation: ViewEncapsulation.None
})
export class ServicesCreateBusinessIdentityPage {

	private readonly createBusinessModalService = inject(CreateBusinessModalService);
	private readonly translateService = inject(TranslateService);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	private readonly ngxLogger = inject(NGXLogger);
	public readonly servicesForm = this.createBusinessQuery.getServicesForm();

	public get serviceList() {
		return (this.servicesForm.value ?? []) as IService[];
	}

	public openServiceFormModal(service?: IService | undefined) {
		let serviceFormToEdit = undefined;
		if (service !== undefined) {
			serviceFormToEdit = new ServiceForm();
			serviceFormToEdit.patchValue(service);
		}
		const {availableLanguages, baseLanguage, currencies, baseCurrency} = this.createBusinessQuery.getBusinessSettings().value;
		this.createBusinessModalService.openServiceFormModal({
			availableLanguages: availableLanguages ?? [],
			baseLanguage: baseLanguage ?? this.translateService.currentLang as LanguageCodeEnum,
			currencies: currencies ?? [],
			baseCurrency: baseCurrency ?? CurrencyCodeEnum.USD,
			serviceForm: serviceFormToEdit
		}).then((newServiceForm) => {
			if (service === undefined) {
				this.servicesForm.push(newServiceForm);
			} else {
				const serviceForm = this.servicesForm.controls.find((control) => control.value._id === service._id);
				if (serviceForm) {
					serviceForm.patchValue(newServiceForm.value as Partial<IService>);
				} else {
					this.ngxLogger.error('Service not found');
				}
			}
		});
	}

}

export default ServicesCreateBusinessIdentityPage;
