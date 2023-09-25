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
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {BusinessIndustryEnum} from "@utility/domain/enum/business-industry.enum";

@Component({
	selector: 'identity-create-business-point-of-sale-page',
	templateUrl: 'index.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		PrimaryLinkButtonDirective,
		FormInputComponent,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index implements AfterViewInit {

	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly businessIndustryControl = this.createBusinessQuery.getBusinessIndustryControl();

	public backPath = 'category';

	public ngAfterViewInit(): void {
		const value = this.businessIndustryControl.value;
		switch (value) {
			case BusinessIndustryEnum.Other:
				this.backPath = 'industry';
				break;
			case BusinessIndustryEnum.TeachingAndConsultation:
				this.backPath = 'service-provide-type';
				break;
		}
		this.changeDetectorRef.detectChanges();
	}

}
