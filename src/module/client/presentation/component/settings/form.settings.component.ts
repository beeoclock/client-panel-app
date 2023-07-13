import {Component, inject, ViewEncapsulation} from '@angular/core';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {SettingsForm} from '@module/client/form/settings.form';
import {ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {NgForOf, NgIf} from '@angular/common';
import {SettingsFormRepository} from "@module/client/repository/settings.form.repository";
import {ISettings} from "@module/client/domain";
import {BooleanState} from "@utility/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {
  SocialNetworkLinkFormComponent
} from "@client/presentation/component/settings/social-network-link.form.component";

@Component({
  selector: 'client-form-settings-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputDirective,
    InputDirective,
    TextareaDirective,
    InputDirective,
    TextareaDirective,
    ButtonComponent,
    ReactiveFormsModule,
    SpinnerComponent,
    NgIf,
    LoaderComponent,
    NgForOf,
    SocialNetworkLinkFormComponent
  ],
  template: `
    <utility-loader *ngIf="loadingData.isOn; else ContentTemplate"></utility-loader>
    <ng-template #ContentTemplate>
      <form [formGroup]="form">
        <img class="w-40 h-40 object-cover mb-2" [src]="form.controls.logo.value" alt="">
        <div class="pb-4">
          <label for="logo">Logo</label>
          <input type="file" class="rounded border px-3 py-2 w-full" id="logo" (change)="handleLogoInput($event)">
        </div>
        <div class="pb-4">
          <label for="name">Name</label>
          <input type="text" class="rounded border px-3 py-2 w-full" id="name" formControlName="name">
        </div>
        <div class="pb-4">
          <label for="slogan">Slogan</label>
          <input type="text" class="rounded border px-3 py-2 w-full" id="slogan" formControlName="slogan">
        </div>
        <div class="pb-4">
          <label for="address">Address</label>
          <input type="text" class="rounded border px-3 py-2 w-full" id="address" formControlName="address">
        </div>
        <div class="pb-4">
          <label for="startingPrice">Starting price</label>
          <input type="text" class="rounded border px-3 py-2 w-full" id="startingPrice" formControlName="startingPrice">
        </div>
        <div class="pb-4">
          <input class="me-2"
                 type="checkbox"
                 role="switch"
                 id="active"
                 formControlName="active">
          <label for="active">Active</label>
        </div>
        <div class="pb-4">
          <label for="description">Description</label>
          <textarea class="rounded border px-3 py-2 w-full"
                    id="description"
                    formControlName="description">
          </textarea>
        </div>


        <div class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 border rounded-lg p-4 mb-4">

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

        </div>

        <button (click)="save()" class="px-4 py-2 border rounded w-full hover:bg-beeColor-100">Save</button>
      </form>
    </ng-template>
  `
})
export class FormSettingsComponent {
  private readonly repository = inject(SettingsFormRepository);
  public readonly loadingData = new BooleanState(true);

  public readonly form = new SettingsForm();

  constructor() {
    // Init data
    this.repository.item().then(({data}) => {
      if (data) {
        this.form.patchValue(data);
        if (data?.socialNetworkLinks?.length) {
          data.socialNetworkLinks.forEach((socialNetworkLink) => {
            this.form.controls.socialNetworkLinks.pushNewOne(socialNetworkLink);
          });
        }
      }
      this.loadingData.switchOff();
    });
  }

  // Save data
  public async save(): Promise<void> {
    await this.repository.save(this.form.getRawValue() as ISettings);
  }

  public async handleLogoInput($event: Event): Promise<void> {
    const target = $event.target as HTMLInputElement;
    await this.form.setLogo(target);
  }
}
