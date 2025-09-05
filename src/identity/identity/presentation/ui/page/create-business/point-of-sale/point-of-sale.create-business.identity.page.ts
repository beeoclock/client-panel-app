import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	ViewEncapsulation
} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@shared/presentation/ui/component/link/back.link.component";
import {ChangeLanguageComponent} from "@shared/presentation/ui/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/identity/infrastructure/query/create-business.query";
import {TranslateModule} from "@ngx-translate/core";
import {
	AddressBusinessProfileComponent
} from "@tenant/client/presentation/ui/component/business-profile/address/address.business-profile.component";

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

	public backPath = 'names';
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly addressForm = this.createBusinessQuery.getAddressForm();

	public ngAfterViewInit(): void {
		this.changeDetectorRef.detectChanges();
	}

}

export default PointOfSaleCreateBusinessIdentityPage;
