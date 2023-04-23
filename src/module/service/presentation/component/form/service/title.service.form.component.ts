import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/directives/is-required/is-required';

@Component({
  selector: 'service-title-service-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    InputErrorComponent,
    HasErrorDirective,
    InputDirective,
    IsRequiredDirective,
  ],
  template: `

    <div class="col-12 mt-2 position-relative">

      <label for="service-form-title" class="form-label">Title</label>
      <input
        isRequired
        beeoclock
        hasError
        placeholder="Write title of service"
        id="service-form-title"
        [formControl]="control">
      <utility-input-error-component
        [control]="control">
      </utility-input-error-component>
    </div>
  `
})
export class TitleServiceFormComponent {

  @Input()
  public control = new FormControl();


}
