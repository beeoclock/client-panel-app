import {AfterViewInit, Directive, HostBinding, Input} from "@angular/core";

@Directive({
	selector: '[tableRowFlex]',
	standalone: true,
})
export class RowTableFlexDirective implements AfterViewInit {

	@Input()
	public tableRowGrid: 'header' | 'body' | 'footer' = 'body';

	@HostBinding()
	public class = [
		'flex',
		'text-beeColor-700',
		'dark:bg-beeDarkColor-800',
		'dark:text-beeDarkColor-400',
	];

	public ngAfterViewInit() {

		switch (this.tableRowGrid) {
			case 'header':
				this.class.push('font-bold', 'text-xs', 'uppercase');
				break;
		}

	}

}
