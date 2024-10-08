import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'app-anybody-specialist-icon-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (wasSelectedAnybody) {
			<app-icon title="Specialist: Anybody" name="tdesignUserUnknown"/>
		}
	`,
	imports: [
		IconComponent
	]
})
export class AnybodySpecialistIconComponent {

	@Input({required: true})
	public wasSelectedAnybody!: boolean;

	@HostBinding('class.contents')
	public get contentsClass(): boolean {
		return !this.wasSelectedAnybody;
	}

}
