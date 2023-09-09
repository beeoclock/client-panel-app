import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'starter-component',
	templateUrl: 'starter.component.html',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PrimaryButtonDirective,
		RouterLink,
	]
})
export class StarterComponent {

	@Input()
	public label!: string;

	@Input()
	public link!: string | string[];

}
