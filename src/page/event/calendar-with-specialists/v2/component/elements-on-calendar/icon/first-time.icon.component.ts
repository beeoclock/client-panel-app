import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'app-first-time-icon-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IconComponent
	],
	template: `
		@if (firstTime) {
			<app-icon title="Specialist: Anybody" name="bootstrapPersonAdd"/>
		}
	`
})
export class FirstTimeIconComponent {

	@Input({required: true})
	public firstTime: boolean = false;

	@HostBinding('class.contents')
	public get contentsClass(): boolean {
		return !this.firstTime;
	}

}
