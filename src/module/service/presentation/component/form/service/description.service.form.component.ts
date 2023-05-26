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
    <div class="flex-col mb-2">
      <label for="service-form-description">Description</label>
      <textarea
        class="border rounded px-3 py-2 w-full"
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
