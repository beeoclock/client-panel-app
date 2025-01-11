import {Component, inject, input, ViewChild, ViewEncapsulation} from "@angular/core";
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
import {MediaStateEnum} from "@utility/presentation/component/image/base.image.component";

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

	public readonly logo = input<RIMedia | null>();

	@ViewChild(ImageLogoBusinessProfileComponent)
	public imageLogoBusinessProfileComponent!: ImageLogoBusinessProfileComponent;

	public readonly toggleInfo = new BooleanState(true);

	public readonly patchMediaLogoClientApiAdapter = inject(PatchMediaLogoClientApiAdapter);

	public async save(): Promise<void> {

		if (this.imageLogoBusinessProfileComponent.mediaState === MediaStateEnum.NOT_CHANGED) {
			return;
		}

		const formData = new FormData();
		formData.append('file', this.imageLogoBusinessProfileComponent.selectedFile as Blob);

		const banner = this.imageLogoBusinessProfileComponent.banner();
  if (banner) {
			formData.append('_id', banner._id);
		}
		await this.patchMediaLogoClientApiAdapter.executeAsync(formData);

		this.imageLogoBusinessProfileComponent.mediaState = MediaStateEnum.NOT_CHANGED;

	}

}
