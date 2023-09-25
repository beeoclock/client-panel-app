import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {ServiceProvideType} from "@utility/domain/service-provide-type";

@Component({
	selector: 'identity-create-business-service-provide-type-page',
	templateUrl: 'index.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		PrimaryLinkButtonDirective,
		FormInputComponent,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		NgForOf,
		TranslateModule,
		ReactiveFormsModule
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index {

	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly serviceProvideTypeControl = this.createBusinessQuery.getServiceProvideTypeControl();
	public readonly listWithIcon = ServiceProvideType.listWithIcon;

	public get valid(): boolean {
		return this.serviceProvideTypeControl.valid;
	}

	public get invalid(): boolean {
		return !this.valid;
	}

}
