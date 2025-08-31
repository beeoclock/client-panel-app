import {BaseActions} from "@shared/state/base/base.actions";
import {ICustomer} from "@tenant/customer/domain";
import {StateEnum} from "@core/shared/enum/state.enum";

export namespace CustomerDataActions {

	export class CreateItem extends BaseActions.CreateItem<ICustomer.EntityRaw> {
		public static override readonly type = '[Customer API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<ICustomer.EntityRaw> {
		public static override readonly type = '[Customer API] Update Item';
	}

	export class SetState {
		public static readonly type = '[Customer API] SetState';

		public constructor(
			public readonly item: ICustomer.DTO,
			public readonly state: StateEnum,
		) {
		}
	}


}
