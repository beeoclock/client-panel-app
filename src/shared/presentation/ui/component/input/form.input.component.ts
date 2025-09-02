import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DoCheck,
	inject,
	input,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IsRequiredDirective} from "@shared/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@shared/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'form-input',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IsRequiredDirective,
		InvalidTooltipDirective,
		ReactiveFormsModule,
		TranslateModule,
	],
	template: `

			<!-- Floating Input -->
			<div class="relative">
				<input
					#input
					isRequired
					invalidTooltip
					[class.h-16]="inputType() === 'color'"
					[step]="step()"
					[min]="min()"
					[formControl]="control()"
					[placeholder]="placeholder() ?? (placeholderTranslateKey() | translate)"
					[id]="id() + '-input'"
					[type]="inputType()"
					[autocomplete]="autocomplete()"

					class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
focus:pt-6
															  focus:pb-2
															  [&:not(:placeholder-shown)]:pt-6
															  [&:not(:placeholder-shown)]:pb-2
															  autofill:pt-6
															  autofill:pb-2">
				<label
					[id]="id() + '-label'"
					[for]="id() + '-input'" class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">
					{{ label() ?? (labelTranslateKey() | translate) }}
				</label>

			</div>
			<!-- End Floating Input -->
	`,
	host: {
		class: 'block'
	}
})
export class FormInputComponent implements DoCheck {

	public readonly label = input<unknown | string>();

	public readonly labelTranslateKey = input('');

	public readonly id = input('utility-base-input');

	public readonly inputType = input('text');

	public readonly min = input<number | null>(null);

	public readonly placeholder = input<string | null>(null);

	public readonly placeholderTranslateKey = input('');

	public readonly autocomplete = input('');

	public readonly autofocus = input(false);

	public readonly step = input(60); // In seconds

	public readonly control = input.required<FormControl>();

	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	private readonly input = viewChild<HTMLInputElement>('input');

	public ngDoCheck(): void {
		this.changeDetectorRef.detectChanges();
	}


}
