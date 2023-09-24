import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {SelectDateComponent} from "@event/presentation/component/form/select-time-slot/select-date.component";
import {SelectTimeComponent} from "@event/presentation/component/form/select-time-slot/select-time.component";
import {DateTime} from "luxon";
import {DatePipe} from "@angular/common";
import {SlotsService} from "@event/presentation/component/form/select-time-slot/slots.service";

@Component({
	selector: 'event-select-time-slot-form-component',
	standalone: true,
	imports: [
		TranslateModule,
		SelectDateComponent,
		SelectTimeComponent,
		DatePipe
	],
	providers: [
		SlotsService
	],
	template: `

		<div class="flex flex-col gap-8 mb-4">

			<strong class="text-2xl dark:text-white">{{ 'keyword.capitalize.dateAndTime' | translate }}</strong>

			<event-select-time-slot-date-form-component
				[control]="control"
				[localDateTimeControl]="localDateTimeControl"/>

			<event-select-time-slot-time-form-component
				[specialist]="specialist"
				[localDateTimeControl]="localDateTimeControl"
				[control]="control"/>

		</div>

	`
})
export class SelectTimeSlotComponent {

	@Input()
	public control!: FormControl<string>;

	@Input()
	public specialist!: string;

	public readonly localDateTimeControl: FormControl<DateTime> = new FormControl(DateTime.now()) as FormControl<DateTime>;

}
