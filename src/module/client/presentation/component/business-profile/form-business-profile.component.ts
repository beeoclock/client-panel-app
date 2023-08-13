import {Component, Input, ViewEncapsulation} from '@angular/core';
import {InputDirective} from '@utility/directives/input/input.directive';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {BusinessProfileForm} from '@client/form/business-profile.form';
import {ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {NgForOf, NgIf} from '@angular/common';
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {
  SocialNetworkLinkFormComponent
} from "@client/presentation/component/settings/social-network-link.form.component";
import {TranslateModule} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";

@Component({
  selector: 'client-business-profile-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputDirective,
    InputDirective,
    InputDirective,
    DeleteButtonComponent,
    ReactiveFormsModule,
    SpinnerComponent,
    NgIf,
    LoaderComponent,
    NgForOf,
    SocialNetworkLinkFormComponent,
    TranslateModule,
    CardComponent,
    FormInputComponent
  ],
  template: `
    <card>

      <form-input
        id="business-profile-form-name"
        type="text"
        autocomplete="name"
        [placeholder]="'general.name' | translate"
        [control]="form.controls.name"
        [label]="'general.name' | translate">
      </form-input>

      <form-input
        id="business-profile-form-slogan"
        type="text"
        autocomplete="slogan"
        [placeholder]="'keyword.capitalize.slogan' | translate"
        [control]="form.controls.slogan"
        [label]="'keyword.capitalize.slogan' | translate">
      </form-input>

<!--      <form-input-->
<!--        id="business-profile-form-address"-->
<!--        type="text"-->
<!--        autocomplete="address"-->
<!--        [placeholder]="'keyword.capitalize.address' | translate"-->
<!--        [control]="form.controls.address"-->
<!--        [label]="'keyword.capitalize.address' | translate">-->
<!--      </form-input>-->

      <form-input
        id="business-profile-form-feature"
        type="text"
        autocomplete="feature"
        [placeholder]="'keyword.capitalize.feature' | translate"
        [control]="form.controls.feature"
        [label]="'keyword.capitalize.feature' | translate">
      </form-input>

      <div class="pb-4">
        <label for="startingPrice">Starting price</label>
        <input type="text" class="rounded border px-3 py-2 w-full" id="startingPrice" formControlName="startingPrice">
      </div>

      <div class="pb-4">
        <label for="description">Description</label>
        <textarea class="focus:ring-2 outline-0 rounded border px-3 py-2 w-full"
                  id="description"
                  formControlName="description">
          </textarea>
      </div>
    </card>

    <card>
      <div class="flex flex-col gap-4">
        <div
          *ngFor="let socialNetworkLink of form.controls.socialNetworkLinks.controls; let index = index"
          class="border border-beeColor-200 rounded-lg dark:bg-beeDarkColor-700 dark:border-beeDarkColor-600 dark:text-white">
          <div
            class="
          justify-between
          flex
          w-full
          px-4
          py-2
          bg-beeColor-100
          border-b
          border-beeColor-200
          rounded-t-lg
          cursor-pointer
          dark:bg-beeDarkColor-800
          dark:border-beeDarkColor-600">
            Social Network Link #{{ index + 1 }}
            <button class="text-red-500" (click)="form.controls.socialNetworkLinks.remove(index)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="p-4">
            <client-form-social-network-link-form-component [form]="socialNetworkLink">
            </client-form-social-network-link-form-component>
          </div>
        </div>
      </div>

      <hr class="my-4">

      <button class="border rounded px-4 py-2" (click)="form.controls.socialNetworkLinks.pushNewOne()">
        <i class="bi bi-plus-lg me-2"></i>
        Add new social network link
      </button>
    </card>
  `
})
export class FormBusinessProfileComponent {

  @Input()
  public form = new BusinessProfileForm();

  public async handleLogoInput($event: Event): Promise<void> {
    const target = $event.target as HTMLInputElement;
    await this.form.setLogo(target);
  }
}
