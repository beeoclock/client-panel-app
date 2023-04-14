import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'utility-input-error-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FirstKeyNameModule,
    NgIf,
    TranslateModule
  ],
  template: `
    {{ 'form.validation.' + (control.errors | firstKeyName) | translate }}
  `
})
export class InputErrorComponent {

  // TODO static handle and scroll to first error

  @Input()
  public control: FormControl = new FormControl();

  @HostBinding()
  public class = 'invalid-tooltip';

}
