import {Directive, HostBinding, Input} from "@angular/core";
import {Reactive} from "@utility/cdk/reactive";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";

@Directive()
export abstract class BaseChangeStatusButtonComponent extends Reactive {

	@Input()
	public item!: IOrderDto;

	@HostBinding()
	public class = `
		cursor-pointer
        flex
        items-center
        justify-center
        rounded-2xl
        bg-white
        hover:bg-beeColor-50
        dark:bg-beeDarkColor-800
        dark:hover:bg-beeDarkColor-600
        px-4
        py-2
        text-sm
        font-semibold
        text-beeColor-900
        dark:text-beeColor-200
        shadow-sm
        ring-1
        ring-inset
        ring-beeColor-300
    `;

}
