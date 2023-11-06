import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {ActiveEnum} from "@utility/domain/enum";
import {is} from "thiis";
import {CardComponent} from "@utility/presentation/component/card/card.component";

@Component({
  selector: 'utility-form-switch-active-block-component',
  standalone: true,
  template: `
		<bee-card>

			<label class="relative inline-flex items-center justify-between cursor-pointer">
        <span
					class="mr-3 text-sm font-medium text-beeColor-900 dark:text-beeDarkColor-300">
          {{ label ?? ('keyword.capitalize.active' | translate) }}
        </span>
				<input [id]="id" type="checkbox" [formControl]="control" class="sr-only peer">
				<div class="
          w-11
          h-6
          bg-beeColor-200
          peer-focus:outline-none
          peer-focus:ring-4
          peer-focus:ring-blue-300
          dark:peer-focus:ring-blue-800
          rounded-full
          peer
          dark:bg-beeDarkColor-700
          peer-checked:after:translate-x-full
          peer-checked:after:border-white
          after:content-['']
          after:absolute
          after:top-[2px]
          after:right-[22px]
          after:bg-white
          after:border-beeColor-300
          after:border
          after:rounded-full
          after:h-5
          after:w-5
          after:transition-all
          dark:border-beeDarkColor-600
          peer-checked:bg-blue-600">
				</div>
			</label>

		</bee-card>
	`,
  imports: [
    NgIf,
    TranslateModule,
    FormInputComponent,
    FormTextareaComponent,
    NgSelectModule,
    ReactiveFormsModule,
    NgForOf,
    CardComponent,
  ]
})
export class SwitchActiveBlockComponent implements OnInit, OnChanges {

  @Input()
  public label: string | undefined;

  @Input()
  public id = '';

  @Input()
  public control = new FormControl(); // External control

  public readonly localControl = new FormControl();

  public ngOnChanges(changes: SimpleChanges & { control: SimpleChange }) {

    if (changes.control) {

      const control = changes.control.currentValue as FormControl;
      this.localControl.setValue(control.value);
      control.valueChanges.subscribe((value) => {
        this.localControl.setValue(value);
      });

    }

  }

  public ngOnInit(): void {

    this.localControl.valueChanges.subscribe((value: ActiveEnum | boolean) => {
      if (is.boolean(value)) {
        this.control.setValue(
          value ? ActiveEnum.YES : ActiveEnum.NO,
        );
      }
    });

  }

}
