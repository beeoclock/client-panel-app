import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
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

@Component({
	selector: 'identity-create-business-portfolio-page',
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
		TranslateModule,
		GalleryBusinessProfileComponent
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index {

	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly galleryForm = this.createBusinessQuery.getGalleryForm();

}
