import {Component, inject, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {BooleanState} from "@utility/domain";
import {
	ImageLogoBusinessProfileComponent
} from "@client/presentation/component/business-profile/logo/image.logo.business-profile/image.logo.business-profile.component";
import {FormControl} from "@angular/forms";
import {SrcByMediaIdService} from "@module/media/presentation/directive/src-by-media-id/src-by-media-id.service";
import {
	PatchMediaLogoClientApiAdapter
} from "@client/adapter/external/api/media/logo/patch.media.logo.client.api.adapter";

@Component({
	selector: 'client-logo-business-profile-component',
	templateUrl: 'logo.business-profile.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		ImageLogoBusinessProfileComponent,
	],
	standalone: true
})
export class LogoBusinessProfileComponent {

	@Input()
	public control = new FormControl();

	@Input()
	public mediaId: string | undefined;

	@ViewChild(ImageLogoBusinessProfileComponent)
	public imageLogoBusinessProfileComponent!: ImageLogoBusinessProfileComponent;

	public readonly toggleInfo = new BooleanState(true);

	public readonly srcByMediaIdService = inject(SrcByMediaIdService);
	public readonly patchMediaLogoClientApiAdapter = inject(PatchMediaLogoClientApiAdapter);

	public async save(): Promise<void> {

		if (this.imageLogoBusinessProfileComponent.mediaIsChanged.isOff) {
			return;
		}

		const body: {
			media: string;
			_id?: string;
		} = {
			media: this.control.value,
		};

		if (this.mediaId) {
			body._id = this.mediaId;
		}

		const {_id, media} = await this.patchMediaLogoClientApiAdapter.executeAsync(body);
		await this.srcByMediaIdService.set(_id, media);

		this.imageLogoBusinessProfileComponent.mediaIsChanged.switchOff();

	}

}
