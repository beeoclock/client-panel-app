import {Directive, HostBinding, input} from "@angular/core";

@Directive({
	selector: '[tableFlex]',
	standalone: true,
})
export class TableTableFlexDirective {

	public readonly tableFlex = input<{
    columns: {
        [key: string]: {
            style?: {
                [key: string]: string | number;
            };
            classList?: string[];
        };
    };
}>();

	@HostBinding()
	public class = [
		'text-start',
		'overflow-scroll',
		'bg-white',
		'h-[calc(100vh-210px)]',
		'md:h-[calc(100vh-135px)]'
	];

}
