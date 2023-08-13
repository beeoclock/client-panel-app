import {Component, Input, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf, NgIf} from "@angular/common";
import {DragAndDropDirective} from "@utility/directives/drag-and-drop/drag-and-drop.directive";
import {
  ImageGalleryBusinessProfileComponent
} from "@client/presentation/component/business-profile/gallery/image.gallery.business-profile.component";
import {GalleryForm} from "@client/form/gallery.form";
import {BooleanState} from "@utility/domain";

@Component({
  selector: 'client-gallery-business-profile-component',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    TranslateModule,
    NgIf,
    DragAndDropDirective,
    ImageGalleryBusinessProfileComponent,
    NgForOf
  ],
  standalone: true,
  template: `
    <card>

      <div class="flex justify-between">
        <strong class="dark:text-white">{{ 'client.profile.form.section.gallery.title' | translate }}</strong>
        <button class="text-beeColor-500 dark:text-beeColor-400 hover:text-beeColor-600 dark:hover:text-beeColor-500"
                (click)="toggleInfo.toggle()">
          <i class="bi" [class.bi-eye]="toggleInfo.isOff" [class.bi-eye-slash]="toggleInfo.isOn"></i>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <client-image-gallery-business-profile-component
          *ngFor="let control of form.controls.images.controls; let index = index;"
          (remove)="form.removeImage(index)"
          [showPlaceholder]="toggleInfo.isOn"
          [index]="index"
          [control]="control">
        </client-image-gallery-business-profile-component>
      </div>

      <div class="text-beeColor-500">
        {{ 'client.profile.form.section.gallery.comment' | translate }}
      </div>
    </card>
  `
})
export class GalleryBusinessProfileComponent {

  @Input()
  public form = new GalleryForm();

  public readonly toggleInfo = new BooleanState(true);


}
