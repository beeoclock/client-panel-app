import {ChangeDetectionStrategy, Component, HostBinding, input, ViewEncapsulation} from "@angular/core";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'app-anybody-specialist-icon-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (wasSelectedAnybody()) {
			<app-icon title="Specialist: Anybody" name="tdesignUserUnknown"/>
		}
	`,
	imports: [
		IconComponent
	]
})
export class AnybodySpecialistIconComponent {

	public readonly wasSelectedAnybody = input.required<boolean>();

	@HostBinding('class.contents')
	public get contentsClass(): boolean {
		return !this.wasSelectedAnybody();
	}

}
