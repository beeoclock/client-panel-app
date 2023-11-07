import {AfterViewInit, Directive, ElementRef, HostBinding, inject, Input} from "@angular/core";

@Directive({
	selector: '[tableRowFlex]',
	standalone: true,
})
export class RowTableFlexDirective implements AfterViewInit {

	@Input()
	public tableRowFlex: 'header' | 'body' | 'footer' = 'body';

	@HostBinding()
	public class = [
		'flex',
		'bg-white',
		'text-beeColor-700',
		'dark:bg-beeDarkColor-800',
		'dark:text-beeDarkColor-400',
	];

	private readonly elementRef = inject(ElementRef<HTMLDivElement>);

	public ngAfterViewInit() {

		switch (this.tableRowFlex) {
			case 'header':
				this.elementRef.nativeElement.classList.add('font-bold', 'text-xs', 'uppercase');
				break;
			case 'body':
				this.elementRef.nativeElement.classList.add('hover:bg-beeColor-100', 'cursor-pointer', 'transition');
				break;
		}

	}

}
