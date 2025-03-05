import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DoCheck,
	HostBinding,
	inject,
	input,
	ViewEncapsulation
} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'form-input-with-left-hint',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IsRequiredDirective,
		InvalidTooltipDirective,
		ReactiveFormsModule,
		DefaultLabelDirective,
		TranslateModule,
	],
	template: `
		@if (showLabel()) {

			<label default [for]="id()">
				{{ label() ?? (labelTranslateKey() | translate) }}
			</label>
		}
		<ng-content/>

		<div
			class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
				<span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
					{{ leftHint() }}
				</span>
			<input
				isRequired
				invalidTooltip
				class="w-full block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
				[isRequiredEnabled]="showLabel()"
				[formControl]="control()"
				[placeholder]="placeholder() ?? (placeholderTranslateKey() | translate)"
				[id]="id()"
				[type]="inputType()"
				[autocomplete]="autocomplete()"/>
		</div>
	`
})
export class FormInputWithLeftHintComponent implements DoCheck {

	public readonly leftHint = input.required<unknown | string>();

	public readonly label = input<unknown | string>();

	public readonly labelTranslateKey = input('');

	public readonly showLabel = input(true);

	public readonly id = input('utility-base-input');

	public readonly inputType = input('text');

	public readonly placeholder = input<string | null>(null);

	public readonly placeholderTranslateKey = input('');

	public readonly autocomplete = input('');

	public readonly control = input.required<FormControl>();

	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	@HostBinding()
	public class = 'block';

	public ngDoCheck(): void {
		this.changeDetectorRef.detectChanges();
	}


}
