import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
  selector: 'form-textarea-component',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule,
    InvalidTooltipDirective,
    ReactiveFormsModule
  ],
  template: `
    <label [for]="id" class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-white">{{ label }}</label>

    <div class="flex flex-col">
      <textarea
        invalidTooltip
        class="mt-2 focus:ring-2 outline-0 border rounded-xl bg-white px-4 py-3 dark:bg-beeDarkColor-900 dark:border-beeDarkColor-700 dark:text-white"
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
