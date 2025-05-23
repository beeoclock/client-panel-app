import {BaseActions} from "@shared/state/base/base.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IProductTag} from "@tenant/product/product-tag/domain";

export namespace ProductTagDataActions {

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Product Tag API] Get List';
	}

	export class CreateItem extends BaseActions.CreateItem<IProductTag.DTO> {
		public static override readonly type = '[Product Tag API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IProductTag.DTO> {
		public static override readonly type = '[Product Tag API] Update Item';
	}

	export class SetState {
		public static readonly type = '[Product Tag API] SetState';

		constructor(
			public readonly item: IProductTag.DTO,
			public readonly state: StateEnum,
		) {
		}
	}
}
