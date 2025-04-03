import EProduct from "@tenant/product/domain/entity/e.product";
import {BaseActions} from "@shared/state/base/base.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IProduct} from "@tenant/product/domain";

export namespace ProductDataActions {

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Product API] Get List';
	}

	export class CreateItem extends BaseActions.CreateItem<EProduct> {
		public static override readonly type = '[Product API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<EProduct> {
		public static override readonly type = '[Product API] Update Item';
	}

	export class SetState {
		public static readonly type = '[Product API] SetState';

		constructor(
			public readonly item: IProduct.DTO,
			public readonly state: StateEnum,
		) {
		}
	}
}
