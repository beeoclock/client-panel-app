import {Component, Input} from '@angular/core';
import {AttendantComponent} from '@event/presentation/component/form/attendees/attendant/attendant.component';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {AttendeesForm} from "@event/presentation/form/attendant.form";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";

@Component({
	selector: 'event-attendees-component',
	templateUrl: 'attendees.component.html',
	standalone: true,
	imports: [
		AttendeesComponent,
		AttendantComponent,
		NgForOf,
		TranslateModule,
		NgIf,
		PrimaryLinkButtonDirective
	],
})
export class AttendeesComponent {

	@Input()
	public form!: AttendeesForm;

	public remove(index: number): void {

		this.form.remove(index);

	}

}
