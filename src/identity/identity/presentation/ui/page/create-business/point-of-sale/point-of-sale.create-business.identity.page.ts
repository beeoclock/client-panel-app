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
import {CreateBusinessQuery} from "@identity/identity/infrastructure/query/create-business.query";
import {BusinessIndustryEnum} from "@core/shared/enum/business-industry.enum";
import {TranslateModule} from "@ngx-translate/core";
import {
	AddressBusinessProfileComponent
} from "@[tenant]/client/presentation/ui/component/business-profile/address/address.business-profile.component";

@Component({
	selector: 'app-point-of-sale-create-business-identity-page',
	templateUrl: './point-of-sale.create-business.identity.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		AddressBusinessProfileComponent,
		TranslateModule
	],
	encapsulation: ViewEncapsulation.None
})
export class PointOfSaleCreateBusinessIdentityPage implements AfterViewInit {

	public backPath = 'category';
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly addressForm = this.createBusinessQuery.getAddressForm();
	public readonly businessIndustryControl = this.createBusinessQuery.getBusinessIndustryControl();

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
