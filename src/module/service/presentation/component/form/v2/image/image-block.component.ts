import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ServiceFormImageComponent} from "@service/presentation/component/form/v2/image/service-form-image.component";
import {PresentationForm} from "@service/presentation/form/service.form";
import {CardComponent} from "@utility/presentation/component/card/card.component";

@Component({
  selector: 'service-form-image-block-component',
  standalone: true,
  template: `
    <card>
      <span class="text-2xl font-bold text-beeColor-500">{{ 'general.image' | translate }}</span>
      <service-form-image-component [control]="form.controls.main"></service-form-image-component>
      <p class="text-beeColor-500">
        {{ 'service.form.v2.section.presentation.motivate' | translate }}
      </p>
    </card>
  `,
  imports: [
    NgIf,
    TranslateModule,
    ServiceFormImageComponent,
    CardComponent
  ]
})
export class ImageBlockComponent {

  @Input()
  public form = new PresentationForm();

}
