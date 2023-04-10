import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {InputComponent} from '@utility/presentation/components/input/input.component';

@Component({
  selector: 'identity-display-name-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <div class="mb-3 position-relative">
      <label
        class="form-label"
        [translate]="label"
        [for]="id"></label>
      <div class="input-group">

        <input [checkFormError]="true"
               [inputGroup]="true"
               [name]="'person-fill'"
               [placeholder]="placeholder | translate"
               [formControl]="control"
               [id]="id"
               hasError
               beeoclock>

      </div>
      <div *ngIf="control.errors" class="invalid-tooltip">
        {{ 'form.validation.' + (control.errors | firstKeyName) | translate }}
      </div>

    </div>
  `,
  imports: [
    ReactiveFormsModule,
    HasErrorModule,
    NgIf,
    TranslateModule,
    FirstKeyNameModule,
    InputComponent,
    InputComponent
  ]
})
export class DisplayNameComponent {

  @Input()
  public id!: string;

  @Input()
  public label!: string;

  @Input()
  public placeholder!: string;

  @Input()
  public control!: FormControl;

}
