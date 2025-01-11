import {Directive, ElementRef, inject, OnChanges, OnInit, SimpleChange, SimpleChanges, input} from "@angular/core";

@Directive({
	selector: 'input[default]',
	standalone: true,
})
export class DefaultInputDirective implements OnInit, OnChanges {

	public readonly additionalClassList = input('');

	private readonly elementRef = inject(ElementRef);

	public ngOnInit() {

		// block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6
		this.elementRef.nativeElement.classList.add(
			'block',
			'w-full',
			'rounded-md',
			'border-0',
			'text-gray-900',
			'shadow-sm',
			'ring-1',
			'ring-inset',
			'ring-gray-300',
			'placeholder:text-gray-400',
			'focus:ring-2',
			'focus:ring-inset',
			'focus:ring-indigo-600',
			'sm:text-sm',
			'sm:leading-6'
		);

	}

	public ngOnChanges(changes: SimpleChanges & {additionalClassList: SimpleChange}) {

		// TODO clear if empty
		if (changes.additionalClassList && changes.additionalClassList.currentValue?.length > 0) {
			this.elementRef.nativeElement.classList.add(...this.additionalClassList().split(' '));
		} else {
			if (changes.additionalClassList.previousValue?.length > 0) {
				this.elementRef.nativeElement.classList.remove(...changes.additionalClassList.previousValue.split(' '));
			}
		}
	}

}
