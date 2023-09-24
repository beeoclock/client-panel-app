import {Component, Input, ViewEncapsulation} from "@angular/core";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";

@Component({
  selector: 'form-input-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
	imports: [
		IsRequiredDirective,
		InvalidTooltipDirective,
		ReactiveFormsModule,
		NgIf,
		DefaultLabelDirective,
	],
  template: `

    <div class="flex items-center justify-between">
      <label [for]="id" default>
        {{ label }}
      </label>
      <div class="text-sm">
        <ng-content select="[label-end]"/>
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
          focus:border-beeColor-800
          sm:leading-6">
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
        <ng-content select="[button-icon]"/>
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
  public placeholder = '';

  @Input()
  public autocomplete = '';

  @Input()
  public type = 'text';

  @Input()
  public callback!: (...args: unknown[]) => any;

  @Input()
  public showButton = true;

  @Input()
  public disabled = false;

  @Input()
  public control!: FormControl;


}
