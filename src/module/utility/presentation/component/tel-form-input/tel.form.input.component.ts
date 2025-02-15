import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DoCheck,
	ElementRef,
	HostBinding,
	inject,
	input,
	OnDestroy,
	viewChild,
	ViewEncapsulation
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {IsRequiredDirective} from '@utility/presentation/directives/is-required/is-required';
import {InvalidTooltipDirective} from '@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive';
import intlTelInput, {Iti} from 'intl-tel-input';
import {is} from '@src/core/shared/checker';
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'tel-form-input',
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
		@if (showLabel()) {
			<label
				[for]="id()"
				class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-white">
				{{ label() || (labelTranslateKey() | translate) }}
			</label>
		}
		<input
			hidden
			isRequired
			invalidTooltip
			[id]="id()"
			[setRedBorderTo]="'#' + id() + '-mirror'"
			[formControl]="control()"
			[isRequiredEnabled]="showLabel()">

		<input
			#inputElement
			[id]="id() + '-mirror'"
			[class.disabled]="control().disabled"
			[placeholder]="placeholder()"
			[autocomplete]="autocomplete()"
			type="tel"
			class="w-full bg-white rounded-md border border-gray-200 px-3 py-2 placeholder:text-slate-600"
		/>
	`,
	host: {
		class: 'w-full'
	}
})
export class TelFormInputComponent implements AfterViewInit, OnDestroy, DoCheck {
	public readonly label = input('');

	public readonly labelTranslateKey = input('');

	public readonly showLabel = input(true);

	public readonly id = input('utility-base-input');

	public readonly placeholder = input<string>('000 00 00 00');

	public readonly placeholderTranslateKey = input<string>('');

	public readonly autocomplete = input<string>('');

	public readonly control = input.required<FormControl<string | null>>();

	// TODO: Implement country code
	// @Input()
	// public countryCode!: 'pl' | 'uk' | 'da';

	readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

	@HostBinding()
	public class = 'block';

	public intlTelInput: Iti | null = null;

	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public ngDoCheck(): void {
		this.changeDetectorRef.detectChanges();
	}

	public ngAfterViewInit() {

		this.intlTelInput = intlTelInput(this.inputElement().nativeElement, {
			initialCountry: 'auto',
			// @ts-ignore
			strictMode: true,
			separateDialCode: true,
			// @ts-ignore
			countryOrder: ['dk', 'pl', 'ua'],
			// @ts-ignore
			loadUtils: () => import("intl-tel-input/utils"),
			geoIpLookup: callback => {
				fetch("https://freeipapi.com/api/json")
					.then(res => res.json())
					.then(data => callback(data.countryCode))
					.catch(() => callback("us"));
			}
		});

		// @ts-ignore
		const {value} = this.control();
		if (is.string_not_empty<string>(value)) this.intlTelInput?.setNumber(value);

		this.inputElement().nativeElement.addEventListener('countrychange', () => {
			// @ts-ignore
			this.control().setValue(this.intlTelInput?.getNumber());
		});

		this.inputElement().nativeElement.addEventListener('input', () => {
			// @ts-ignore
			this.control().setValue(this.intlTelInput?.getNumber());
			// @ts-ignore
			if (!this.intlTelInput.isValidNumber()) this.control().setErrors({
				'invalid': true
			});

		});
	}

	public ngOnDestroy() {
		// @ts-ignore
		this.intlTelInput?.['destroy']?.();
	}

}
