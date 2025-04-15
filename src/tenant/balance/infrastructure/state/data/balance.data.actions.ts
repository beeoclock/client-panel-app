import {BaseActions} from "@shared/state/base/base.actions";
import {IBalance} from "@tenant/balance/domain";

export namespace BalanceDataActions {

	export class CreateItem extends BaseActions.CreateItem<IBalance.EntityRaw> {
		public static override readonly type = '[Balance API] Create Item';
	}


}
