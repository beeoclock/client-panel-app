import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, inject, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {InvalidTooltipDirective} from "@shared/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";
import {IsRequiredDirective} from "@shared/presentation/directives/is-required/is-required";

@Component({
  selector: 'form-textarea-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		InvalidTooltipDirective,
		ReactiveFormsModule,
		DefaultLabelDirective,
		IsRequiredDirective
	],
  template: `
    <label [for]="id()" default>
			{{ label() ?? (labelTranslateKey() | translate) }}
		</label>

    <div class="flex flex-col">
      <textarea
        invalidTooltip
        isRequired
        class="focus:ring-2 outline-0 border border-beeColor-300 rounded-md bg-white px-3 py-1.5 dark:bg-beeDarkColor-900 dark:border-beeDarkColor-700 dark:text-white"
        [rows]="rows()"
				[placeholder]="placeholder() ?? (placeholderTranslateKey() | translate)"
        [id]="id()"
        [formControl]="control()"></textarea>
    </div>
  `
})
export class FormTextareaComponent implements DoCheck {

  public readonly control = input.required<FormControl<string>>();

  public readonly label = input<unknown | string>();

  public readonly labelTranslateKey = input('');

  public readonly placeholder = input<unknown | string>();

  public readonly placeholderTranslateKey = input('');

  public readonly id = input('');

  public readonly rows = input(4);

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  public ngDoCheck(): void {
    this.changeDetectorRef.detectChanges();
  }

}
