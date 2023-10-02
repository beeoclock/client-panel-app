import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	ViewEncapsulation
} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {SchedulesFormComponent} from "@utility/presentation/component/schedule/schedules.form.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'identity-create-business-services-page',
	templateUrl: './index.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		PrimaryLinkButtonDirective,
		FormInputComponent,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		SchedulesFormComponent,
		TranslateModule
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index implements AfterViewInit {

	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly schedulesForm = this.createBusinessQuery.getSchedulesForm();
	public readonly serviceProvideTypeControl = this.createBusinessQuery.getServiceProvideTypeControl();

	public backPath = 'point-of-sale';

	public ngAfterViewInit(): void {
		const value = this.serviceProvideTypeControl.value;
		switch (value) {
			case ServiceProvideTypeEnum.Online:
				this.backPath = 'service-provide-type';
				break;
			default:
				this.backPath = 'point-of-sale';
		}
		this.changeDetectorRef.detectChanges();
	}

}
