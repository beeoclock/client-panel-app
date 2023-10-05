import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DateTime} from "luxon";
import {DatePipe} from "@angular/common";
import {SlotsService} from "@event/presentation/component/form/select-time-slot/slots.service";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {SelectDateComponent} from "@event/presentation/component/form/select-time-slot/date/select-date.component";
import {SelectTimeComponent} from "@event/presentation/component/form/select-time-slot/time/select-time.component";

@Component({
	selector: 'event-select-time-slot-form-component',
	templateUrl: './select-time-slot.component.html',
	standalone: true,
	imports: [
		TranslateModule,
		DatePipe,
		InvalidTooltipComponent,
		SelectDateComponent,
		SelectTimeComponent
	],
	providers: [
		SlotsService
	]
})
export class SelectTimeSlotComponent {

	@Input({required: true})
	public control!: FormControl<string>;

	@Input({required: true})
	public specialist!: string;

	@Input({required: true})
	public eventDurationInSeconds!: number;

	public readonly localDateTimeControl: FormControl<DateTime> = new FormControl(DateTime.now()) as FormControl<DateTime>;

}
