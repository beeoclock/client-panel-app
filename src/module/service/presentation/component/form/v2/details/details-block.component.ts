import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {TagsComponent} from "@service/presentation/component/form/v2/details/tags.component";
import {LanguageVersionForm} from "@service/presentation/form/service.form";
import {CardComponent} from "@utility/presentation/component/card/card.component";

@Component({
  selector: 'service-form-details-block-component',
  standalone: true,
  template: `
    <card>
      <span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.details' | translate }}</span>

      <form-input
        id="service-title"
        type="text"
        autocomplete="service.title"
        [placeholder]="'keyword.capitalize.Title' | translate"
        [control]="form.controls.title"
        [label]="'keyword.capitalize.Title' | translate">
      </form-input>

      <form-textarea-component
        [control]="form.controls.description"
        [label]="'keyword.capitalize.description' | translate"
        [placeholder]="'keyword.capitalize.placeholder.description' | translate">
      </form-textarea-component>

<!--      <service-form-tags-component></service-form-tags-component>-->

    </card>
  `,
  imports: [
    NgIf,
    TranslateModule,
    FormInputComponent,
    FormTextareaComponent,
    TagsComponent,
    CardComponent,
  ]
})
export class DetailsBlockComponent {

  @Input()
  public form = new LanguageVersionForm();

}
