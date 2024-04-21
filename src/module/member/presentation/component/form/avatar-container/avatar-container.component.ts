import {Component, inject, Input, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormControl} from "@angular/forms";
import {BooleanState} from "@utility/domain";
import {PatchMemberMediaApiAdapter} from "@member/adapter/external/api/media/patch.member-media.api.adapter";
import {RESPONSE_IMemberMedia} from "@member/domain/interface/i.member-media";
import {AvatarFormComponent} from "@member/presentation/component/form/avatar-form/avatar-form.component";

@Component({
	selector: 'member-form-avatar-container-component',
	templateUrl: './avatar-container.component.html',
	standalone: true,
	imports: [
		NgIf,
		TranslateModule,
		CardComponent,
		NgForOf,
		AvatarFormComponent
	]
})
export class AvatarContainerComponent {

	@Input()
	public control!: FormControl<RESPONSE_IMemberMedia>;

	@ViewChild(AvatarFormComponent)
	public avatarFormComponent!: AvatarFormComponent;

	public readonly toggleInfo = new BooleanState(true);

	public readonly patchMemberMediaApiAdapter = inject(PatchMemberMediaApiAdapter);

	public async save(memberId: string): Promise<void> {

		const component = this.avatarFormComponent;

		const formData = new FormData();
		formData.append('file', component.selectedFile as Blob);

		// if (component.avatar) {
		// 	formData.append('_id', component.avatar._id);
		// }

		await this.patchMemberMediaApiAdapter.executeAsync(memberId, formData);

	}

}
