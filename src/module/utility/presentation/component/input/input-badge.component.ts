import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgxMaskDirective} from "ngx-mask";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";

@Component({
  selector: 'form-badge-input',
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
          px-3
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
            {{ badge }}
        </span>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    InvalidTooltipDirective,
    HasErrorDirective,
    NgxMaskDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputBadgeComponent {

  @Input()
  public placeholder: string = '';

  @Input()
  public label: string = '';

  @Input()
  public mask: string = '';

  @Input()
  public id: string = '';

  @Input()
  public badge: string = '';

  @Input()
  public control = new FormControl();

}
