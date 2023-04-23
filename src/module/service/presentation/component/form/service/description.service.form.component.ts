import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';

@Component({
  selector: 'service-description-service-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    TextareaDirective,
    HasErrorDirective,
    InputErrorComponent,
  ],
  template: `

    <div class="col-12 mt-2 position-relative">
      <label for="service-form-description">Description</label>
      <textarea
        beeoclock
        hasError
        placeholder="Write some description of service"
        id="service-form-description"
        [formControl]="control"></textarea>
      <utility-input-error-component
        [control]="control">
      </utility-input-error-component>
    </div>
  `
})
export class DescriptionServiceFormComponent {

  @Input()
  public control = new FormControl();


}
