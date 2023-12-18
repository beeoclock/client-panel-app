import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, inject, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";

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
    <label [for]="id" default>
			{{ label ?? (labelTranslateKey | translate) }}
		</label>

    <div class="flex flex-col">
      <textarea
        invalidTooltip
        isRequired
        class="focus:ring-2 outline-0 border border-beeColor-300 rounded-md bg-white px-3 py-1.5 dark:bg-beeDarkColor-900 dark:border-beeDarkColor-700 dark:text-white"
        [rows]="rows"
				[placeholder]="placeholder ?? (placeholderTranslateKey | translate)"
        [id]="id"
        [formControl]="control"></textarea>
    </div>
  `
})
export class FormTextareaComponent implements DoCheck {

  @Input()
  public control!: FormControl<string>;

  @Input()
  public label: unknown | string;

  @Input()
  public labelTranslateKey = '';

  @Input()
  public placeholder: unknown | string;

  @Input()
  public placeholderTranslateKey = '';

  @Input()
  public id = '';

  @Input()
  public rows = 4;

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  public ngDoCheck(): void {
    this.changeDetectorRef.detectChanges();
  }

}
