import {Directive, ElementRef, forwardRef, HostListener, inject} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const NULL_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => NullValueAccessorDirective),
	multi: true
};

@Directive({
	selector: '[emptyStringToNull]',
	providers: [NULL_VALUE_ACCESSOR],
	standalone: true
})
export class NullValueAccessorDirective implements ControlValueAccessor {

	private readonly elementRef = inject(ElementRef);

	@HostListener('input', ['$event.target.value'])
	input(value: any) {
		if (value === '') {
			this.onChange(null);
		} else {
			this.onChange(value);
		}
	}

	// Implement ControlValueAccessor interface
	writeValue(value: any): void {
		if (value === null || value === undefined) {
			value = '';
		}
		// Set the value on the input element
		const element = (this.elementRef.nativeElement as HTMLInputElement);
		element.value = value;
	}

	onChange = (_: any) => {};
	onTouched = () => {};

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
}
