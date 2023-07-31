import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {HasErrorDirective} from "@utility/directives/has-error/has-error.directive";
import {NgxMaskDirective} from "ngx-mask";

@Component({
  selector: 'input-badge-component',
  standalone: true,
  template: `
    <label [for]="id">{{ label }}</label>
    <div class="flex">
      <input
        [id]="id"
        [formControl]="control"
        [placeholder]="placeholder"
        [mask]="mask"
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
