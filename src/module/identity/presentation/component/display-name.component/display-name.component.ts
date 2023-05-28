import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {InputDirective} from '@utility/directives/input/input.directive';

import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

// TODO change to taildwind
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
               [name]="'person-fill'"
               [placeholder]="placeholder | translate"
               [formControl]="control"
               [id]="id"
               hasError
               invalidTooltip>

      </div>

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
    InvalidTooltipDirective
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
