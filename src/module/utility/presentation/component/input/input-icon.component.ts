import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {HasErrorDirective} from "@utility/directives/has-error/has-error.directive";
import {NgxMaskDirective} from "ngx-mask";
import {NgClass} from "@angular/common";

@Component({
  selector: 'form-icon-input',
  standalone: true,
  template: `
    <label class="dark:text-beeDarkColor-300 block text-sm font-medium leading-6 text-beeColor-900 dark:text-white" [for]="id">{{ label }}</label>
    <div class="flex">
      <input
        [id]="id"
        [formControl]="control"
        [placeholder]="placeholder"
        [mask]="mask"
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
          px-1
          text-beeColor-500
          bg-beeColor-100
          border
          border-l-0
          border-beeColor-300
          rounded-r
          dark:bg-beeDarkColor-600
          dark:text-beeDarkColor-400
          dark:border-beeDarkColor-600">
        <i class="bi" [ngClass]="icon"></i>
        </span>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    InvalidTooltipDirective,
    HasErrorDirective,
    NgxMaskDirective,
    NgClass
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputIconComponent {

  @Input()
  public placeholder: string = '';

  @Input()
  public label: string = '';

  @Input()
  public mask: string = '';

  @Input()
  public id: string = '';

  @Input()
  public icon: string = '';

  @Input()
  public control = new FormControl();

}
