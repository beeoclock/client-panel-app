import {Component, inject, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {BooleanState} from "@utility/domain";
import {
	ImageLogoBusinessProfileComponent
} from "@client/presentation/component/business-profile/logo/image.logo.business-profile/image.logo.business-profile.component";
import {
	PatchMediaLogoClientApiAdapter
} from "@client/adapter/external/api/media/logo/patch.media.logo.client.api.adapter";
import {
	ImageCoverImageBusinessProfileComponent
} from "@client/presentation/component/business-profile/cover-image/image.cover-image.business-profile/image.cover-image.business-profile.component";
import {NgForOf, NgIf} from "@angular/common";
import {RIMedia} from "@module/media/domain/interface/i.media";

@Component({
	selector: 'client-logo-business-profile-component',
	templateUrl: './logo.business-profile.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		ImageLogoBusinessProfileComponent,
		ImageCoverImageBusinessProfileComponent,
		NgForOf,
		NgIf,
	],
	standalone: true
})
export class LogoBusinessProfileComponent {

	@Input()
	public logo: RIMedia | null | undefined;

	@ViewChild(ImageLogoBusinessProfileComponent)
	public imageLogoBusinessProfileComponent!: ImageLogoBusinessProfileComponent;

	public readonly toggleInfo = new BooleanState(true);

	public readonly patchMediaLogoClientApiAdapter = inject(PatchMediaLogoClientApiAdapter);

	public async save(): Promise<void> {

		if (this.imageLogoBusinessProfileComponent.mediaIsChanged.isOff) {
			return;
		}

		const formData = new FormData();
		formData.append('file', this.imageLogoBusinessProfileComponent.selectedFile as Blob);

		if (this.imageLogoBusinessProfileComponent.banner) {
			formData.append('_id', this.imageLogoBusinessProfileComponent.banner._id);
		}
		await this.patchMediaLogoClientApiAdapter.executeAsync(formData);

		this.imageLogoBusinessProfileComponent.mediaIsChanged.switchOff();

	}

}
