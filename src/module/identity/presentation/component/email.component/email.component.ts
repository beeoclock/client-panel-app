import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {InputDirective} from '@utility/directives/input/input.directive';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';

@Component({
  selector: 'identity-email-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <div class="mb-3 position-relative">
      <label
        class="form-label"
        [translate]="label"
        [id]="id"></label>
      <div class="input-group">

        <input [checkFormError]="true"
               [inputGroup]="true"
               [name]="'person-fill'"
               [placeholder]="placeholder | translate"
               [formControl]="control"
               [id]="id"
               autofocus
               hasError
               beeoclock
               type="email">

      </div>
      <utility-input-error-component [control]="control"></utility-input-error-component>

    </div>
  `,
  imports: [
    ReactiveFormsModule,
    HasErrorDirective,
    NgIf,
    TranslateModule,
    FirstKeyNameModule,
    InputDirective,
    InputDirective,
    InputErrorComponent
  ]
})
export class EmailComponent {

  @Input()
  public id!: string;

  @Input()
  public label!: string;

  @Input()
  public placeholder!: string;

  @Input()
  public control!: FormControl;

}
