import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@shared/presentation/ui/component/link/back.link.component";
import {ChangeLanguageComponent} from "@shared/presentation/ui/component/change-language/change-language.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CreateBusinessQuery} from "@identity/identity/infrastructure/query/create-business.query";
import {NgForOf} from "@angular/common";

import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {FormButtonWithIconComponent} from "@shared/presentation/ui/component/button/form-button-with-icon.component";
import {ServiceForm} from "@tenant/service/presentation/form";
import {NGXLogger} from "ngx-logger";
import {CurrencyCodeEnum, LanguageCodeEnum} from "@core/shared/enum";
import {IService} from "@tenant/service/domain/interface/i.service";
import {
	CreateBusinessModalService
} from "@tenant/service/presentation/ui/component/form/modal/create-business/create-business.modal.service";
import {ServiceItemComponent} from "@tenant/service/presentation/ui/component/list/item/item.componen";


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
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesCreateBusinessIdentityPage {

	private readonly createBusinessModalService = inject(CreateBusinessModalService);
	private readonly translateService = inject(TranslateService);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly servicesForm = this.createBusinessQuery.getServicesForm();
	private readonly ngxLogger = inject(NGXLogger);

	public get serviceList() {
		return (this.servicesForm.value ?? []) as IService.DTO[];
	}

	public openServiceFormModal(service?: IService.DTO | undefined) {
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
			baseLanguage: baseLanguage ?? this.translateService.getCurrentLang() as LanguageCodeEnum,
			currencies: currencies ?? [],
			baseCurrency: baseCurrency ?? CurrencyCodeEnum.USD,
			serviceForm: serviceFormToEdit
		}).then((newServiceForm) => {
			if (service === undefined) {
				this.servicesForm.push(newServiceForm);
			} else {
				const serviceForm = this.servicesForm.controls.find((control) => control.value._id === service._id);
				if (serviceForm) {
					serviceForm.patchValue(newServiceForm.value as Partial<IService.DTO>);
				} else {
					this.ngxLogger.error('Service not found');
				}
			}
			this.changeDetectorRef.detectChanges();
		});
	}

}

export default ServicesCreateBusinessIdentityPage;
