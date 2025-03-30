import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {TranslateModule} from "@ngx-translate/core";
import {CreateBusinessQuery} from "@identity/identity/infrastructure/query/create-business.query";
import {Reactive} from "@utility/cdk/reactive";
import {
	GalleryBusinessProfileComponent
} from "@tenant/client/presentation/ui/component/business-profile/gallery/gallery.business-profile/gallery.business-profile.component";

@Component({
	selector: 'app-portfolio-create-business-identity-page',
	templateUrl: './portfolio.create-business.identity.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		TranslateModule,
		GalleryBusinessProfileComponent
	],
	encapsulation: ViewEncapsulation.None
})
export class PortfolioCreateBusinessIdentityPage extends Reactive implements AfterViewInit {

	public readonly galleryForm = this.createBusinessQuery.getGalleryForm();

	constructor(
		private readonly createBusinessQuery: CreateBusinessQuery,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		super();
	}

	public ngAfterViewInit(): void {
		this.galleryForm.valueChanges.pipe(this.takeUntil()).subscribe(() => {
			this.changeDetectorRef.detectChanges();
		});
	}

}

export default PortfolioCreateBusinessIdentityPage;
