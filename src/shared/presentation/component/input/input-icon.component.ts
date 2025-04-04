import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgxMaskDirective} from "ngx-mask";
import {NgClass} from "@angular/common";
import {InvalidTooltipDirective} from "@shared/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {HasErrorDirective} from "@shared/presentation/directives/has-error/has-error.directive";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";

@Component({
  selector: 'form-icon-input',
  standalone: true,
  template: `
    <label default [for]="id()">{{ label() }}</label>
    <div class="flex">
      <input
        [id]="id()"
        [formControl]="control()"
        [placeholder]="placeholder()"
        [mask]="mask()"
        [dropSpecialCharacters]="false"
        type="text"
        hasError
        invalidTooltip
        class="
          rounded-none
          rounded-l
          border
          text-beeColor-900
          focus:ring-blue-500
          focus:border-blue-500
          block
          flex-1
          min-w-0
          w-full
          text-sm
          border-beeColor-300
          py-2
          px-2
          dark:bg-beeDarkColor-700
          dark:border-beeDarkColor-600
          dark:placeholder-beeDarkColor-400
          dark:text-white
          dark:focus:ring-blue-500
          dark:focus:border-blue-500">
      <span
        class="
          inline-flex
          items-center
          text-sm
          px-3
          text-beeColor-500
          bg-beeColor-100
          border
          border-l-0
          border-beeColor-300
          rounded-r
          dark:bg-beeDarkColor-600
          dark:text-beeDarkColor-400
          dark:border-beeDarkColor-600">
        <i class="bi" [ngClass]="icon()"></i>
        </span>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		InvalidTooltipDirective,
		HasErrorDirective,
		NgxMaskDirective,
		NgClass,
		DefaultLabelDirective
	],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputIconComponent {

  public readonly placeholder = input('');

  public readonly label = input('');

  public readonly mask = input('');

  public readonly id = input('');

  public readonly icon = input('');

  public readonly control = input(new FormControl());

}
