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
				style: {
					[key: string]: string | number;
				}
			}
		}
	};

	@HostBinding()
	public class = [
		'text-start',
		'overflow-scroll',
		'flex',
		'flex-col',
		'h-[calc(100vh-246px)]',
		'md:h-[calc(100vh-135px)]'
	];

}
