import {BaseActions} from "@shared/state/base/base.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IBalance} from "@tenant/balance/domain";

export namespace BalanceDataActions {

	export class CreateItem extends BaseActions.CreateItem<IBalance.EntityRaw> {
		public static override readonly type = '[Balance API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IBalance.EntityRaw> {
		public static override readonly type = '[Balance API] Update Item';
	}

	export class SetState {
		public static readonly type = '[Balance API] SetState';

		constructor(
			public readonly item: IBalance.DTO,
			public readonly state: StateEnum,
		) {
		}
	}


}
