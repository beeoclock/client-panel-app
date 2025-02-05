import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {ServiceItemComponent} from "@service/presentation/component/list/item/item.componen";
import {NgForOf} from "@angular/common";

import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormButtonWithIconComponent} from "@utility/presentation/component/button/form-button-with-icon.component";
import {
	CreateBusinessModalService
} from "@service/presentation/component/form/modal/create-business/create-business.modal.service";
import {ServiceForm} from "@service/presentation/form";
import {NGXLogger} from "ngx-logger";
import {CurrencyCodeEnum, LanguageCodeEnum} from "@utility/domain/enum";
import {IServiceDto} from "@order/domain/interface/i.service.dto";


@Component({
	selector: 'app-services-create-business-identity-page',
	templateUrl: './services.create-business.identity.page.html',
	standalone: true,
	imports: [
		RouterLink,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		TranslateModule,
		ServiceItemComponent,
		NgForOf,
		CardComponent,
		FormButtonWithIconComponent,
	],
	encapsulation: ViewEncapsulation.None
})
export class ServicesCreateBusinessIdentityPage {

	private readonly createBusinessModalService = inject(CreateBusinessModalService);
	private readonly translateService = inject(TranslateService);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly servicesForm = this.createBusinessQuery.getServicesForm();
	private readonly ngxLogger = inject(NGXLogger);

	public get serviceList() {
		return (this.servicesForm.value ?? []) as IServiceDto[];
	}

	public openServiceFormModal(service?: IServiceDto | undefined) {
		let serviceFormToEdit = undefined;
		if (service !== undefined) {
			serviceFormToEdit = new ServiceForm();
			serviceFormToEdit.patchValue(service);
		}
		const {
			availableLanguages,
			baseLanguage,
			currencies,
			baseCurrency
		} = this.createBusinessQuery.getBusinessSettings().value;
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
					serviceForm.patchValue(newServiceForm.value as Partial<IServiceDto>);
				} else {
					this.ngxLogger.error('Service not found');
				}
			}
		});
	}

}

export default ServicesCreateBusinessIdentityPage;
