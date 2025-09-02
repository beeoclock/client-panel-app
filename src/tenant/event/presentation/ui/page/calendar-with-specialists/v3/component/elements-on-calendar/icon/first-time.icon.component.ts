import {ChangeDetectionStrategy, Component, HostBinding, input, ViewEncapsulation} from "@angular/core";
import {IconComponent} from "@shared/presentation/ui/component/adapter/icon/icon.component";

@Component({
	selector: 'app-first-time-icon-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IconComponent
	],
	template: `
		@if (firstTime()) {
			<app-icon title="First time" name="bootstrapPersonAdd"/>
		}
	`
})
export class FirstTimeIconComponent {

	public readonly firstTime = input.required<boolean>();

	@HostBinding('class.contents')
	public get contentsClass(): boolean {
		return !this.firstTime();
	}

}
