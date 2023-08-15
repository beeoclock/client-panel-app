import {Component, Input, ViewEncapsulation} from "@angular/core";
import {SocialNetworksForm} from "@client/form/social-network.form";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf} from "@angular/common";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
  SocialNetworkLinkFormComponent
} from "@client/presentation/component/business-profile/social-media/social-network-link.form.component";

@Component({
  selector: 'client-business-profile-social-media-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <card>

      <strong class="dark:text-white">
        {{ 'keyword.capitalize.socialMedia' | translate }}
      </strong>

      <div class="flex flex-col gap-4">
        <div
          *ngFor="let socialNetworkLink of form.controls; let index = index"
          class="flex gap-4">

          <client-form-social-network-link-form-component class="w-full" [form]="socialNetworkLink">
          </client-form-social-network-link-form-component>

          <button class="text-beeColor-600 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-full"
                  (click)="form.remove(index)">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <button class="border rounded px-4 py-2" (click)="form.pushNewOne()">
        <i class="bi bi-plus-lg me-2"></i>
        {{ 'keyword.capitalize.addSocialMedia' | translate }}
      </button>
    </card>
  `,
  imports: [
    TranslateModule,
    NgForOf,
    SocialNetworkLinkFormComponent,
    CardComponent,
    SocialNetworkLinkFormComponent
  ]
})
export class BusinessProfileSocialMediaComponent {

  @Input()
  public form!: SocialNetworksForm;

}