import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StateEnum} from "@core/shared/enum/state.enum";
import {PaymentStatusEnum} from "@tenant/order/payment/domain/enum/payment.status.enum";
import {IntervalTypeEnum} from "@tenant/analytic/domain/enum/interval.enum";
import {DateTime} from "luxon";

export interface IFilterForm {

	phrase: FormControl<string>;
	state: FormControl<StateEnum | null>;
	status: FormControl<PaymentStatusEnum[] | null>;
	dateRange: FormGroup<{
		interval: FormControl<IntervalTypeEnum>;
		selectedDate: FormControl<string>;
	}>;

}

export class FilterForm extends FormGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			state: new FormControl(StateEnum.active),
			status: new FormControl([
				PaymentStatusEnum.registered,
				PaymentStatusEnum.pending,
				PaymentStatusEnum.succeeded,
				PaymentStatusEnum.failed,
			], [
				Validators.minLength(1),
			]),
			dateRange: new FormGroup({
				interval: new FormControl<IntervalTypeEnum>(IntervalTypeEnum.month, {
					nonNullable: true
				}),
				selectedDate: new FormControl<string>(DateTime.now().toJSDate().toISOString(), {
					nonNullable: true
				}),
			})
		});
	}
}
