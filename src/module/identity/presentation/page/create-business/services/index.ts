import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {TranslateModule} from "@ngx-translate/core";
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


@Component({
	selector: 'identity-create-business-schedules-page',
	templateUrl: './index.html',
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
export default class Index {

	private readonly createBusinessModalService = inject(CreateBusinessModalService);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly servicesForm = this.createBusinessQuery.getServicesForm();

	public get serviceList() {
		return (this.servicesForm.value ?? []) as IService[];
	}

	public openServiceFormModal() {
		this.createBusinessModalService.openServiceFormModal().then((serviceForm) => {
			console.log(serviceForm);
			this.servicesForm.push(serviceForm);
		});
	}

}
