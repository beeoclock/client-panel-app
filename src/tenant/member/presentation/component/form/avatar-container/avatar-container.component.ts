import {Component, inject, input, viewChild} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import {BooleanState} from "@utility/domain";
import {
	PatchMemberMediaApiAdapter
} from "@tenant/member/infrastructure/data-source/api/media/patch.member-media.api.adapter";
import {RESPONSE_IMemberMedia} from "@core/business-logic/member/interface/i.member-media";
import {AvatarFormComponent} from "@tenant/member/presentation/component/form/avatar-form/avatar-form.component";
import {NGXLogger} from "ngx-logger";

@Component({
	selector: 'member-form-avatar-container-component',
	templateUrl: './avatar-container.component.html',
	standalone: true,
	imports: [
		TranslateModule,
		AvatarFormComponent
	]
})
export class AvatarContainerComponent {

	public readonly control = input.required<FormControl<RESPONSE_IMemberMedia>>();

	readonly avatarFormComponent = viewChild.required(AvatarFormComponent);

	public readonly toggleInfo = new BooleanState(true);

	public readonly patchMemberMediaApiAdapter = inject(PatchMemberMediaApiAdapter);
	public readonly ngxLogger = inject(NGXLogger);

	public async save(memberId: string): Promise<void> {

		const component = this.avatarFormComponent();

		this.ngxLogger.debug('AvatarContainerComponent:save', component);

		if (!component.selectedFile) {
			return;
		}

		const formData = new FormData();
		formData.append('file', component.selectedFile as Blob);

		// if (component.avatar) {
		// 	formData.append('_id', component.avatar._id);
		// }

		await this.patchMemberMediaApiAdapter.executeAsync(memberId, formData);

	}

}
