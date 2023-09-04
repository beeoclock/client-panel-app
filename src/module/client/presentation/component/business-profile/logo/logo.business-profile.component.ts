import {Component, Input, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {BooleanState} from "@utility/domain";
import {
	ImageGalleryBusinessProfileComponent
} from "@client/presentation/component/business-profile/logo/image.logo.business-profile/image.logo.business-profile.component";
import {FormControl} from "@angular/forms";

@Component({
	selector: 'client-logo-business-profile-component',
	templateUrl: 'logo.business-profile.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		ImageGalleryBusinessProfileComponent,
	],
	standalone: true
})
export class LogoBusinessProfileComponent {

	public readonly toggleInfo = new BooleanState(true);

	@Input()
	public control = new FormControl();

}
