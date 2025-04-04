import {Component, Input, ViewEncapsulation} from "@angular/core";
import {SocialNetworksForm} from "@tenant/client/presentation/form/social-network.form";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf} from "@angular/common";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {
	SocialNetworkLinkFormComponent
} from "@tenant/client/presentation/ui/component/business-profile/social-media/social-network-link.form.component";
import {FormButtonWithIconComponent} from "@shared/presentation/component/button/form-button-with-icon.component";

@Component({
	selector: 'client-business-profile-social-media-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<bee-card>

			<strong class="dark:text-white">
				{{ 'keyword.capitalize.socialMedia' | translate }}
			</strong>

			<div class="flex flex-col gap-4">
				<div
					*ngFor="let socialNetworkLink of form.controls; let index = index"
					class="flex gap-4">

					<client-form-social-network-link-form-component class="w-full" [form]="socialNetworkLink"/>

					<button
						type="button"
						class="text-beeColor-600 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-full"
						(click)="form.removeAt(index)">
						<i class="bi bi-trash"></i>
					</button>
				</div>
			</div>

			<div class="flex">
				<bee-form-button-with-icon (click)="form.pushNewOne()" [label]="'keyword.capitalize.addSocialMedia' | translate"/>
			</div>
		</bee-card>
	`,
	imports: [
		TranslateModule,
		NgForOf,
		SocialNetworkLinkFormComponent,
		CardComponent,
		SocialNetworkLinkFormComponent,
		FormButtonWithIconComponent
	]
})
export class BusinessProfileSocialMediaComponent {

	@Input()
	public form!: SocialNetworksForm;

}
