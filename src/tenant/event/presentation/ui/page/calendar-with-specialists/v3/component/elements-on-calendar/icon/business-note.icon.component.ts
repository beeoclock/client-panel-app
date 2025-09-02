import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import {IconComponent} from "@shared/presentation/ui/component/adapter/icon/icon.component";

@Component({
	standalone: true,
	selector: 'app-business-note-icon-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (businessNote.length) {
			<app-icon [title]="businessNote" name="remixStickyNoteAddLine"/>
		}
	`,
	imports: [
		IconComponent
	]
})
export class BusinessNoteIconComponent {

	@Input({required: true})
	public businessNote: string = '';

	@HostBinding('class.contents')
	public get contentsClass(): boolean {
		return !this.businessNote.length;
	}

}
