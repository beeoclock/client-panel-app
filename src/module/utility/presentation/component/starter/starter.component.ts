import {ChangeDetectionStrategy, Component, ViewEncapsulation, input} from "@angular/core";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
	selector: 'starter-component',
	templateUrl: './starter.component.html',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PrimaryButtonDirective,
		RouterLink,
		NgOptimizedImage,
	]
})
export class StarterComponent {

	public readonly label = input.required<string>();

	public readonly link = input.required<string | string[]>();

}
