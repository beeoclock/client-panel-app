import {Component, Input, ViewEncapsulation} from "@angular/core";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'form-input-password',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    IsRequiredDirective,
    InvalidTooltipDirective,
    ReactiveFormsModule,
  ],
  template: `

    <div class="flex items-center justify-between">
      <label [for]="id" class="dark:text-beeDarkColor-300 block text-sm font-medium leading-6 text-beeColor-900 dark:text-white">
        {{ label }}
      </label>
      <div class="text-sm">
        <ng-content select="[label-end]"></ng-content>
      </div>
    </div>
    <div class="mt-2 flex">
      <input
        #passwordInput
        isRequired
        invalidTooltip
        type="password"
        [disabled]="disabled"
        [formControl]="control"
        [placeholder]="placeholder"
        [id]="id"
        [autocomplete]="autocomplete"
        class="
          px-3
          w-full
          rounded-l-md
          py-1.5
          text-beeColor-900
          dark:text-beeDarkColor-100
          dark:bg-beeDarkColor-700
          border
          border-r-0
          border-beeColor-300
          placeholder:text-beeColor-400
          focus:border-beeColor-800
          sm:text-sm sm:leading-6">
      <button
        (click)="passwordInput.type = passwordInput.type === 'text' ? 'password' : 'text'"
        class="
          px-3
          rounded-r-md
          hover:bg-beeColor-100
          border
          border-l-0
          border-beeColor-300">
        <i
          class="bi"
          [class.bi-eye-slash]="passwordInput.type === 'text'"
          [class.bi-eye]="passwordInput.type === 'password'">
        </i>
      </button>
    </div>

  `
})
export class FormInputPasswordComponent {

  @Input()
  public label = 'todo';

  @Input()
  public id = 'utility-base-input';

  @Input()
  public placeholder: string = '';

  @Input()
  public autocomplete: string = '';

  @Input()
  public disabled = false;

  @Input()
  public control!: FormControl;


}
