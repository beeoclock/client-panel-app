import {Component, Input, ViewEncapsulation} from "@angular/core";
import {IsRequiredDirective} from "@utility/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'form-input-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    IsRequiredDirective,
    InvalidTooltipDirective,
    ReactiveFormsModule,
    NgIf,
  ],
  template: `

    <div class="flex items-center justify-between">
      <label [for]="id" class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-white">
        {{ label }}
      </label>
      <div class="text-sm">
        <ng-content select="[label-end]"></ng-content>
      </div>
    </div>
    <div class="mt-2 flex">
      <input
        isRequired
        invalidTooltip
        [type]="type"
        [disabled]="disabled"
        [formControl]="control"
        [placeholder]="placeholder"
        [id]="id"
        [autocomplete]="autocomplete"
        [class.border-r-0]="showButton"
        [class.rounded-r-0]="showButton"
        class="
          px-3
          w-full
          rounded-md
          py-1.5
          text-beeColor-900
          dark:text-beeDarkColor-100
          dark:bg-beeDarkColor-700
          border
          border-beeColor-300
          placeholder:text-beeColor-400
          focus:border-stone-800
          sm:text-sm sm:leading-6">
      <button
        (click)="callback()"
        *ngIf="showButton"
        class="
          px-3
          rounded-r-md
          hover:bg-beeColor-100
          border
          border-l-0
          border-beeColor-300">
        <ng-content select="[button-icon]"></ng-content>
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
  public type: string = 'text';

  @Input()
  public callback!: (...args: unknown[]) => any;

  @Input()
  public showButton = true;

  @Input()
  public disabled = false;

  @Input()
  public control!: FormControl;


}
