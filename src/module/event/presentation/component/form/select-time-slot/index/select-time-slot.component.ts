import {Component, inject, Input, input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DateTime} from "luxon";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SlotsService} from "@event/presentation/component/form/select-time-slot/slots.service";
import {IDayItem} from "@utility/domain/interface/i.day-item";
import {EventConfigurationForm} from "@event/presentation/form/configuration.form";
import {DatetimeLocalInputComponent} from "@utility/presentation/component/input/datetime-local.input.component";

@Component({
	selector: 'event-select-time-slot-form-component',
	templateUrl: './select-time-slot.component.html',
	standalone: true,
	imports: [
		TranslateModule,
		InvalidTooltipComponent,
		DynamicDatePipe,
		DatetimeLocalInputComponent,
	]
})
export class SelectTimeSlotComponent {

	public readonly control = input.required<FormControl<string>>();

	public readonly configurationForm = input.required<EventConfigurationForm>();

	@Input({required: true})
	public editable!: boolean;

	public readonly localDateTimeControl: FormControl<DateTime | null> = new FormControl(null);
	public readonly slotsService = inject(SlotsService);

	public updateDayItemList(dayItemList: IDayItem[]) {
		this.slotsService
			.setDayItemList(dayItemList)
			.initSlots()
			.then();
	}

}
