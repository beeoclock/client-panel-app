import {Directive, ElementRef, inject, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from "@angular/core";

@Directive({
	selector: 'input[default]',
	standalone: true,
})
export class DefaultInputDirective implements OnInit, OnChanges {

	@Input()
	public additionalClassList = '';

	private readonly elementRef = inject(ElementRef);

	public ngOnInit() {

		this.elementRef.nativeElement.classList.add(
			'px-3',
			'block',
			'w-full',
			'rounded-md',
			'py-1.5',
			'text-beeColor-900',
			'dark:text-beeDarkColor-100',
			'dark:bg-beeDarkColor-900',
			'outline-0',
			'border',
			'border-beeColor-300',
			'dark:border-beeColor-700',
			'placeholder:text-beeColor-400',
			'focus:ring-2',
			'sm:leading-6'
		);

	}

	public ngOnChanges(changes: SimpleChanges & {additionalClassList: SimpleChange}) {

		// TODO clear if empty
		if (changes.additionalClassList && changes.additionalClassList.currentValue?.length > 0) {
			this.elementRef.nativeElement.classList.add(...this.additionalClassList.split(' '));
		} else {
			if (changes.additionalClassList.previousValue?.length > 0) {
				this.elementRef.nativeElement.classList.remove(...changes.additionalClassList.previousValue.split(' '));
			}
		}
	}

}
