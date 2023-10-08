import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DateTime} from "luxon";
import {DatePipe, NgIf} from "@angular/common";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {SelectDateComponent} from "@event/presentation/component/form/select-time-slot/date/select-date.component";
import {SelectTimeComponent} from "@event/presentation/component/form/select-time-slot/time/select-time.component";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";

@Component({
	selector: 'event-select-time-slot-form-component',
	templateUrl: './select-time-slot.component.html',
	standalone: true,
	imports: [
		TranslateModule,
		DatePipe,
		InvalidTooltipComponent,
		SelectDateComponent,
		SelectTimeComponent,
		NgIf,
		HumanizeDurationPipe,
		DynamicDatePipe
	]
})
export class SelectTimeSlotComponent {

	@Input({required: true})
	public control!: FormControl<string>;

	@Input({required: true})
	public editable = true;

	public readonly localDateTimeControl: FormControl<DateTime> = new FormControl(DateTime.now()) as FormControl<DateTime>;

}
