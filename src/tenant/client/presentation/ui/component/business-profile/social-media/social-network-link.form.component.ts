import {Component, input, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SocialNetworkForm} from "@tenant/client/presentation/form/social-network.form";
import {SOCIAL_NETWORKS} from "@core/shared/enum/social-network.enum";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormInputComponent} from "@shared/presentation/ui/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'client-form-social-network-link-form-component',
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
        <ng-select id="type"
          [formControl]="form().controls.type"
          [items]="socialNetworks"
          [clearable]="false" />
      </div>
      <div class="w-full">
        <form-input
          id="business-profile-form-social-media-link-input"
          autocomplete="socialMedia.link"
          placeholder="https://example.com"
          [control]="form().controls.link"
		  [label]="'keyword.capitalize.socialMedia' | translate"/>
      </div>
    </div>
  `
})
export class SocialNetworkLinkFormComponent {

  public readonly form = input.required<SocialNetworkForm>();

  public readonly socialNetworks = SOCIAL_NETWORKS;

}
