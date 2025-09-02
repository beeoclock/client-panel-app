import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import {IconComponent} from "@shared/presentation/ui/component/adapter/icon/icon.component";

@Component({
	standalone: true,
	selector: 'app-note-icon-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (note.length) {
			<app-icon [title]="note" name="bootstrapChatText"/>
		}
	`,
	imports: [
		IconComponent
	]
})
export class NoteIconComponent {

	@Input({required: true})
	public note: string = '';

	@HostBinding('class.contents')
	public get contentsClass(): boolean {
		return !this.note.length;
	}

}
