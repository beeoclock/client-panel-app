import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StateEnum} from "@core/shared/enum/state.enum";
import {PaymentStatusEnum} from "@tenant/payment/domain/enum/payment.status.enum";

export interface IFilterForm {

	phrase: FormControl<string>;
	state: FormControl<StateEnum | null>;
	status: FormControl<PaymentStatusEnum[] | null>;

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
		});
	}
}
