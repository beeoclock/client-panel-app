import {Directive, HostBinding, Input} from "@angular/core";

@Directive({
	selector: '[tableFlex]',
	standalone: true,
})
export class TableTableFlexDirective {

	@Input()
	public tableFlex: undefined | {
		columns: {
			[key: string]: {
				style?: {
					[key: string]: string | number;
				},
				classList?: string[];
			}
		}
	};

	@HostBinding()
	public class = [
		'text-start',
		'overflow-scroll',
		'bg-white',
		'h-[calc(100vh-199px)]',
		'md:h-[calc(100vh-135px)]'
	];

}
