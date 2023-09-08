import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {ContactForm} from "@client/presentation/form/contact.form";
import {CELL_COUNTRY_PREFIX_OBJECT_LIST} from "@utility/domain/enum/cell-country-prefix.enum";

@Component({
  selector: 'client-form-contact-phone-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    FormInputComponent,
    TranslateModule
  ],
  template: `
    <div class="flex gap-4 justify-between">

      <div class="w-40">

        <ng-select
          id="type"
          bindLabel="label"
          bindValue="id"
          [formControl]="form.controls.countryCode"
          [items]="cellCountryPrefixObjectList"
          [clearable]="false">
          <ng-template ng-label-tmp let-item="item" let-clear="clear">
            {{ item.shortLabel }}
          </ng-template>
        </ng-select>

      </div>

      <div class="w-full">

        <form-input
          id="business-profile-form-social-media-link-input"
          autocomplete="socialMedia.link"
          placeholder="000000000"
          [control]="form.controls.phoneNumber"
          [showLabel]="false"/>

      </div>

    </div>
  `
})
export class ContactPhoneFormComponent {

  @Input()
  public form!: ContactForm;

  public readonly cellCountryPrefixObjectList = CELL_COUNTRY_PREFIX_OBJECT_LIST;

}
