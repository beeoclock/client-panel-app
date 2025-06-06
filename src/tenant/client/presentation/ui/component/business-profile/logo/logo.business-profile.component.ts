import {Component, inject, input, viewChild, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {BooleanState} from "@shared/domain";
import {
	ImageLogoBusinessProfileComponent
} from "@tenant/client/presentation/ui/component/business-profile/logo/image.logo.business-profile/image.logo.business-profile.component";
import {
	PatchMediaLogoClientApiAdapter
} from "@tenant/client/infrastructure/data-source/api/media/logo/patch.media.logo.client.api.adapter";
import {RIMedia} from "@tenant/media/domain/interface/i.media";
import {MediaStateEnum} from "@shared/presentation/component/image/base.image.component";

@Component({
	selector: 'client-logo-business-profile-component',
	templateUrl: './logo.business-profile.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		ImageLogoBusinessProfileComponent,
	],
	standalone: true
})
export class LogoBusinessProfileComponent {

	public readonly logo = input<RIMedia | null>();

	readonly imageLogoBusinessProfileComponent = viewChild.required(ImageLogoBusinessProfileComponent);

	public readonly toggleInfo = new BooleanState(true);

	public readonly patchMediaLogoClientApiAdapter = inject(PatchMediaLogoClientApiAdapter);

	public async save(): Promise<void> {

		const imageLogoBusinessProfileComponent = this.imageLogoBusinessProfileComponent();
		if (imageLogoBusinessProfileComponent.mediaState === MediaStateEnum.NOT_CHANGED) {
			return;
		}

		// const file = imageLogoBusinessProfileComponent.selectedFile;
		// if (file) {
		// 	this.updateClientLogo$(file);
		// }

		const formData = new FormData();
		formData.append('file', imageLogoBusinessProfileComponent.selectedFile as Blob);

		const banner = imageLogoBusinessProfileComponent.banner();
		if (banner) {
			formData.append('_id', banner._id);
		}
		await this.patchMediaLogoClientApiAdapter.executeAsync(formData);

		imageLogoBusinessProfileComponent.mediaState = MediaStateEnum.NOT_CHANGED;

	}

	// @Dispatch()
	// private updateClientLogo$(file: Blob): ClientActions.UpdateClientLogo {
	// 	return new ClientActions.UpdateClientLogo(file);
	// }

}
