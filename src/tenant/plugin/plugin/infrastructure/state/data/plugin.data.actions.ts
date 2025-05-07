import {BaseActions} from "@shared/state/base/base.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IPlugin} from "@tenant/plugin/plugin/domain";

export namespace PluginDataActions {

	export class CreateItem extends BaseActions.CreateItem<IPlugin.EntityRaw> {
		public static override readonly type = '[Plugin API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IPlugin.EntityRaw> {
		public static override readonly type = '[Plugin API] Update Item';
	}

	export class SetState {
		public static readonly type = '[Plugin API] SetState';

		constructor(
			public readonly item: IPlugin.DTO,
			public readonly state: StateEnum,
		) {
		}
	}


}
