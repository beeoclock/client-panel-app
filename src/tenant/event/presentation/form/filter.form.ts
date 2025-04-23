import {FormControl} from '@angular/forms';
import {EventStatusEnum} from "@core/shared/enum/event-status.enum";
import {PaginationFilterFromGroup} from "@shared/pagination-filter-from-group";

export interface IFilterForm {

	phrase: FormControl<string>;
	status: FormControl<EventStatusEnum>;
	// start: FormControl<string>;
	// end: FormControl<string>;

}

export class FilterForm extends PaginationFilterFromGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			status: new FormControl(),
			// start: new FormControl(),
			// end: new FormControl(),
		});
		this.initValue();
	}

	public initValue(): void {
		this.controls.status.setValue(EventStatusEnum.booked);

		// 	const start = new Date();
		// 	start.setDate(start.getDate() - 7);
		// 	start.setHours(0);
		// 	start.setMinutes(0);
		// 	start.setSeconds(0);
		// 	this.controls.start.setValue(start.toISOString());
		// 	const end = new Date();
		// 	end.setDate(end.getDate() + 8);
		// 	end.setHours(0);
		// 	end.setMinutes(0);
		// 	end.setSeconds(0);
		// 	this.controls.end.setValue(end.toISOString());
	}
}
