import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'service-form-switch-active-block-component',
  standalone: true,
  template: `
    <div
      class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-2xl p-4 flex flex-col gap-3">

      <!--      <span class="text-2xl font-bold text-gray-500">{{ 'general.active' | translate }}</span>-->

      <label class="relative inline-flex items-center justify-between cursor-pointer">
        <span
          class="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ 'general.active' | translate }}</span>
        <input type="checkbox" [formControl]="control" class="sr-only peer">
        <div class="
          w-11
          h-6
          bg-gray-200
          peer-focus:outline-none
          peer-focus:ring-4
          peer-focus:ring-blue-300
          dark:peer-focus:ring-blue-800
          rounded-full
          peer
          dark:bg-gray-700
          peer-checked:after:translate-x-full
          peer-checked:after:border-white
          after:content-['']
          after:absolute
          after:top-[2px]
          after:right-[22px]
          after:bg-white
          after:border-gray-300
          after:border
          after:rounded-full
          after:h-5
          after:w-5
          after:transition-all
          dark:border-gray-600
          peer-checked:bg-blue-600">
        </div>
      </label>


    </div>
  `,
  imports: [
    NgIf,
    TranslateModule,
    FormInputComponent,
    FormTextareaComponent,
    NgSelectModule,
    ReactiveFormsModule,
    NgForOf,
  ]
})
export class SwitchActiveBlockComponent {

  @Input()
  public control = new FormControl();
}
