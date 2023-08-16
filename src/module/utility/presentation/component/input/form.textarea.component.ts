import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
  selector: 'form-textarea-component',
  standalone: true,
  imports: [
    TranslateModule,
    InvalidTooltipDirective,
    ReactiveFormsModule
  ],
  template: `
    <label [for]="id"
           class="dark:text-beeDarkColor-300 block text-sm font-medium leading-6 text-beeColor-900 dark:text-white">{{ label }}</label>

    <div class="flex flex-col">
      <textarea
        invalidTooltip
        class="focus:ring-2 outline-0 sm:text-sm border border-beeColor-300 rounded-md bg-white px-3 py-1.5 dark:bg-beeDarkColor-900 dark:border-beeDarkColor-700 dark:text-white"
        [rows]="rows"
        [placeholder]="placeholder"
        [id]="id"
        [formControl]="control"></textarea>
    </div>
  `
})
export class FormTextareaComponent {

  @Input()
  public control!: FormControl<string>;

  @Input()
  public label = 'Label';

  @Input()
  public placeholder = '';

  @Input()
  public id = '';

  @Input()
  public rows = 4;

}
