import {Component, Input, ViewEncapsulation} from "@angular/core";
import {IsRequiredDirective} from "@utility/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'form-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    IsRequiredDirective,
    InvalidTooltipDirective,
    ReactiveFormsModule,
  ],
  template: `
    <label [for]="id" class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-white">
      {{ label }}
    </label>
    <div class="mt-2">
      <input
        isRequired
        invalidTooltip
        [disabled]="disabled"
        [formControl]="control"
        [placeholder]="placeholder"
        [id]="id"
        [type]="type"
        [autocomplete]="autocomplete"
        class="
          px-3
          block
          w-full
          rounded-xl
          py-1.5
          text-beeColor-900
          dark:text-beeDarkColor-100
          dark:bg-beeDarkColor-900
          outline-0
          border
          border-beeColor-300
          dark:border-beeColor-700
          placeholder:text-beeColor-400
          focus:ring-2
          sm:text-sm sm:leading-6">
    </div>
  `
})
export class FormInputComponent {

  @Input()
  public label = 'todo';

  @Input()
  public id = 'utility-base-input';

  @Input()
  public type: string = 'text';

  @Input()
  public placeholder: string = '';

  @Input()
  public autocomplete: string = '';

  @Input()
  public disabled = false;

  @Input()
  public control!: FormControl;


}
