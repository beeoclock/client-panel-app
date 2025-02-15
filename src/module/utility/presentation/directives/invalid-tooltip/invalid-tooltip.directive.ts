import {Directive, DoCheck, ElementRef, inject, input, Optional} from '@angular/core';
import {AbstractControl, NgControl} from '@angular/forms';
import {is} from "@src/core/shared/checker";
import {TranslateService} from "@ngx-translate/core";
import {getFirstKey} from "@utility/domain";
import {DOCUMENT} from "@angular/common";

@Directive({
	selector: '[invalidTooltip]',
	standalone: true
})
export class InvalidTooltipDirective implements DoCheck {

	public readonly needTouched = input(true);

	public readonly basePathOfTranslate = input('form.validation.');

	public readonly setRedBorderTo = input<string>();

	public control: undefined | null | AbstractControl;

	public invalidCustomTooltip: undefined | HTMLDivElement;

	@Optional()
	private readonly ngControl = inject(NgControl);
	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly translateService = inject(TranslateService);
	private readonly document = inject(DOCUMENT);
	private reason: string | null = null;

	private readonly invalidClassList = ['!border-red-500', '!ring-red-500'];

	public ngDoCheck(): void {
		this.control = this.ngControl?.control; // Get the associated control
		this.detection(); // Call the function to mark invalid elements
	}

	// Detect if control has error, if it true that add
	// invalid custom tooltip about the error
	// if it false that we try to remove existing invalid custom tooltip
	public detection(): void {

		if (this.needTouched()) {
			if (this.control?.untouched) {
				return;
			}
		}

		const hasError = is.object_not_empty(this.control?.errors);

		if (hasError) {

			this.buildInvalidCustomTooltip();

		} else {

			this.disposeInvalidCustomTooltip();

		}

	}

	// Delete existing invalid custom tooltip form DOM
	public disposeInvalidCustomTooltip(): void {

		this.invalidCustomTooltip?.remove();

		this.reason = null;

		// Remove red border from input
		const setRedBorderTo = this.setRedBorderTo();
  if (setRedBorderTo) {
			const element = document.querySelector(setRedBorderTo);
			if (element) {
				this.invalidClassList.forEach((className) => {
					element.classList.remove(className);
				});
			}
		} else {
			this.invalidClassList.forEach((className) => {
				this.elementRef.nativeElement.classList.remove(className);
			});
		}

	}

	// Add invalid custom tooltip in DOM
	public buildInvalidCustomTooltip(): void {

		// Check if control is exist and if it is untouched
		if (!this.control || this.control.root.untouched) {
			return;
		}

		// Get first key of errors from control errors object
		const key = getFirstKey(this.control.errors);

		// Check if tooltip is existed
		if (this.invalidCustomTooltip) {
			// Check reason, if the same then leave the function
			if (this.reason === key) {
				return;
			}
			this.invalidCustomTooltip?.remove();
		}

		// Update reason
		this.reason = key;

		// Check if element has parent element to set relative position
		if (!this.elementRef.nativeElement.parentElement) {
			return;
		}

		// Check if parent has relative position
		if (
			!this.elementRef.nativeElement.parentElement.classList.contains('relative')
		) {
			// If it has not that add
			this.elementRef.nativeElement.parentElement.classList.add('relative')
		}

		// Build custom DOM element
		this.invalidCustomTooltip = document.createElement('div');
		this.invalidCustomTooltip.classList.add(
			'absolute',
			'top-full',
			'rounded-b',
			'bg-red-500',
			'text-white',
			'px-3',
			'py-1',
			'z-30',
			'max-w-[calc(100%-12px)]',
			'right-[6px]'
		);

		// Set message about error
		this.invalidCustomTooltip.innerText = this.translateService.instant(
			this.basePathOfTranslate() + key,
			this.control.errors?.[key] ?? undefined
		);

		this.elementRef.nativeElement.parentElement.appendChild(this.invalidCustomTooltip);

		// Add border red to input
		const setRedBorderTo = this.setRedBorderTo();
  if (setRedBorderTo) {
			const element = this.document.querySelector(setRedBorderTo);
			if (element) {
				this.invalidClassList.forEach((className) => {
					element.classList.add(className);
				});
			}
		} else {
			this.invalidClassList.forEach((className) => {
				this.elementRef.nativeElement.classList.add(className);
			});
		}

	}

}
