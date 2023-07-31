import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ServiceFormImageComponent} from "@service/presentation/component/form/v2/image/service-form-image.component";

@Component({
  selector: 'service-form-image-block-component',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-2xl p-4 flex flex-col gap-3">
      <span class="text-2xl font-bold text-gray-500">{{ 'general.image' | translate }}</span>
      <service-form-image-component></service-form-image-component>
      <p class="text-gray-500">
        You can inject a little more personality into your services and help people recognize your work by uploading a image (an image, photo or other graphic icon of your service).
      </p>
    </div>
  `,
  imports: [
    NgIf,
    TranslateModule,
    ServiceFormImageComponent
  ]
})
export class ImageBlockComponent {


}
