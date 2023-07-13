import {Component, inject, ViewEncapsulation} from '@angular/core';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {SettingsForm} from '@module/client/form/settings.form';
import {ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {NgIf} from '@angular/common';
import {SettingsFormRepository} from "@module/client/repository/settings.form.repository";
import {ISettings} from "@module/client/domain";
import {BooleanState} from "@utility/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

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
    LoaderComponent
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
      }
      this.loadingData.switchOff();
    });
  }

  // Save data
  public async save(): Promise<void> {
    await this.repository.save(this.form.value as ISettings);
  }

  public async handleLogoInput($event: Event): Promise<void> {
    const target = $event.target as HTMLInputElement;
    await this.form.setLogo(target);
  }
}
