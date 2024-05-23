import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {TranslateModule} from "@ngx-translate/core";
import {
	GalleryBusinessProfileComponent
} from "@client/presentation/component/business-profile/gallery/gallery.business-profile/gallery.business-profile.component";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'app-portfolio-create-business-identity-ui-page',
	templateUrl: './portfolio.create-business.identity.ui.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		PrimaryLinkButtonDirective,
		FormInputComponent,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		TranslateModule,
		GalleryBusinessProfileComponent
	],
	encapsulation: ViewEncapsulation.None
})
export class PortfolioCreateBusinessIdentityUiPage extends Reactive implements AfterViewInit {

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

export default PortfolioCreateBusinessIdentityUiPage;
