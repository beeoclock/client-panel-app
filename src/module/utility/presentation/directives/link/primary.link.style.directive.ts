import {Directive, HostBinding} from "@angular/core";

@Directive({
	selector: 'a[primaryLinkStyle]',
	standalone: true,
})
export class PrimaryLinkStyleDirective {

	@HostBinding()
	public class = [
		'text-blue-600',
		'hover:bg-blue-100',
		'dark:hover:bg-beeDarkColor-800',

		'rounded-2xl',
		'px-4',
		'py-2',
		'flex',
		'flex-wrap',
		'items-center',
		'justify-start',
	];

}
