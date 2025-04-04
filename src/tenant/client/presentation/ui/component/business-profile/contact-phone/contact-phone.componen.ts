import {Component, Input, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf} from "@angular/common";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {ContactsForm} from "@tenant/client/presentation/form/contact.form";
import {
	ContactPhoneFormComponent
} from "@tenant/client/presentation/ui/component/business-profile/contact-phone/contact-phone.form.component";
import {FormButtonWithIconComponent} from "@shared/presentation/component/button/form-button-with-icon.component";

@Component({
	selector: 'client-business-profile-contact-phone-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<bee-card>

			<strong class="dark:text-white">
				{{ 'keyword.capitalize.contactPhone' | translate }}
			</strong>

			<div class="flex flex-col gap-4">
				<div
					*ngFor="let contactForm of form.controls; let index = index"
					class="flex gap-4">

					<client-form-contact-phone-form-component class="w-full" [form]="contactForm"/>

					<button
						type="button"
						class="text-beeColor-600 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-full"
						(click)="form.removeAt(index)">
						<i class="bi bi-trash"></i>
					</button>
				</div>
			</div>

			<div class="flex">
				<bee-form-button-with-icon
					(click)="form.pushNewOne()"
					[label]="'keyword.capitalize.addContactPhone' | translate"/>
			</div>
		</bee-card>
	`,
	imports: [
		TranslateModule,
		NgForOf,
		CardComponent,
		ContactPhoneFormComponent,
		FormButtonWithIconComponent
	]
})
export class BusinessProfileContactPhoneComponent {

	@Input()
	public form!: ContactsForm;

}
