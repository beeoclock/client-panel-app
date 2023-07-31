import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {TagsComponent} from "@service/presentation/component/form/v2/details/tags.component";
import {LanguageVersionForm} from "@service/form/service.form";

@Component({
  selector: 'service-form-details-block-component',
  standalone: true,
  template: `
    <div
      class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-2xl p-4 flex flex-col gap-3">
      <span class="text-2xl font-bold text-gray-500">{{ 'general.details' | translate }}</span>

      <form-input
        id="service-title"
        type="text"
        autocomplete="service.title"
        [placeholder]="'general.title' | translate"
        [control]="form.controls.title"
        [label]="'general.title' | translate">
      </form-input>

      <form-textarea-component
        [control]="form.controls.description"
        [label]="'general.description' | translate"
        [placeholder]="'Write here description of service' | translate">
      </form-textarea-component>

      <service-form-tags-component></service-form-tags-component>

    </div>
  `,
  imports: [
    NgIf,
    TranslateModule,
    FormInputComponent,
    FormTextareaComponent,
    TagsComponent,
  ]
})
export class DetailsBlockComponent {

  @Input()
  public form = new LanguageVersionForm();

}
