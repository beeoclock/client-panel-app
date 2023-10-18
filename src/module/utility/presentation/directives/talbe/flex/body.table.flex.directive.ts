import {Directive, HostBinding} from "@angular/core";

@Directive({
	selector: '[tableBodyFlex]',
	standalone: true,
})
export class BodyTableFlexDirective {

	@HostBinding()
	public class = [
		'bg-white',
	];

}
