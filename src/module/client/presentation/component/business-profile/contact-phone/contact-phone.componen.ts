import {Component, Input, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf} from "@angular/common";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ContactsForm} from "@client/presentation/form/contact.form";
import {
  ContactPhoneFormComponent
} from "@client/presentation/component/business-profile/contact-phone/contact-phone.form.component";

@Component({
  selector: 'client-business-profile-contact-phone-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <card>

      <strong class="dark:text-white">
        {{ 'keyword.capitalize.contactPhone' | translate }}
      </strong>

      <div class="flex flex-col gap-4">
        <div
          *ngFor="let contactForm of form.controls; let index = index"
          class="flex gap-4">

          <client-form-contact-phone-form-component class="w-full" [form]="contactForm">
          </client-form-contact-phone-form-component>

          <button class="text-beeColor-600 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-full"
                  (click)="form.remove(index)">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <button class="border rounded px-4 py-2" (click)="form.pushNewOne()">
        <i class="bi bi-plus-lg me-2"></i>
        {{ 'keyword.capitalize.addContactPhone' | translate }}
      </button>
    </card>
  `,
  imports: [
    TranslateModule,
    NgForOf,
    CardComponent,
    ContactPhoneFormComponent
  ]
})
export class BusinessProfileContactPhoneComponent {

  @Input()
  public form!: ContactsForm;

}
