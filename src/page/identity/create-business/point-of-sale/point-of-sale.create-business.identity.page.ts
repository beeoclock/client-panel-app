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
import {
    AddressBusinessProfileComponent
} from "@client/presentation/component/business-profile/address/address.business-profile.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'app-point-of-sale-create-business-identity-page',
	templateUrl: './point-of-sale.create-business.identity.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		PrimaryLinkButtonDirective,
		FormInputComponent,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		AddressBusinessProfileComponent,
		TranslateModule
	],
	encapsulation: ViewEncapsulation.None
})
export class PointOfSaleCreateBusinessIdentityPage implements AfterViewInit {

	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly addressForm = this.createBusinessQuery.getAddressForm();
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

export default PointOfSaleCreateBusinessIdentityPage;
