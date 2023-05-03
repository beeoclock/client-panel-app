import {Component, inject, ViewEncapsulation} from '@angular/core';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {SettingsForm} from '@company/form/settings.form';
import {ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {NgIf} from '@angular/common';
import {SettingsFormRepository} from "@company/repository/settings.form.repository";
import BooleanStateModel from "@utility/domain/boolean.state.model";
import {ISettings} from "@company/domain";

@Component({
  selector: 'company-form-settings-component',
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
    NgIf
  ],
  template: `
    <div spinner *ngIf="loadingData.isOn; else Content"></div>
    <ng-template #Content>
      <form [formGroup]="form" class="row g-3">
        <div class="col-lg-10">
          <label class="form-label" for="first-name">Name</label>
          <input beeoclock id="name" formControlName="name">
        </div>
        <div class="col-lg-2">
          <label class="form-label" for="flexSwitchCheckDefault">Active</label>
          <div class="form-check form-switch d-flex align-items-center fs-2">
            <input class="form-check-input" type="checkbox" role="switch" id="active"
                   formControlName="active">
          </div>
        </div>
        <div class="col-lg-12">
          <label class="form-label" for="intro">Description</label>
          <textarea beeoclock id="description" formControlName="description">
      </textarea>
        </div>
        <div class="col-12 d-grid">
          <button (click)="save()" beeoclock>Save</button>
        </div>
      </form>
    </ng-template>
  `
})
export class FormSettingsComponent {
  private readonly repository = inject(SettingsFormRepository);
  public readonly loadingData: BooleanStateModel = new BooleanStateModel(true);

  public readonly form = new SettingsForm();

  constructor() {
    // Init data
    this.repository.item('settings').then(({data}) => {
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

}
