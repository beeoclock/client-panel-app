import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	ViewEncapsulation
} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {ServiceProvideTypeEnum} from "@core/shared/enum/service-provide-type.enum";
import {CreateBusinessQuery} from "@identity/identity/infrastructure/query/create-business.query";
import {SchedulesFormComponent} from "@utility/presentation/component/schedule/schedules.form.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'app-schedules-create-business-identity-page',
	templateUrl: './schedules.create-business.identity.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		SchedulesFormComponent,
		TranslateModule
	],
	encapsulation: ViewEncapsulation.None
})
export class SchedulesCreateBusinessIdentityPage implements AfterViewInit {

	public backPath = 'point-of-sale';
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly schedulesForm = this.createBusinessQuery.getSchedulesForm();
	public readonly serviceProvideTypeControl = this.createBusinessQuery.getServiceProvideTypeControl();

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

export default SchedulesCreateBusinessIdentityPage;
