import {ITableState, PITableState} from "@utility/domain/table.state";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BaseActions {

	export class Init {
		public static readonly type: string = '[TODO] Not Implemented Yet!';
	}

	export class GetList {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: {
				force: boolean;
				resetPage: boolean;
				resetParams: boolean;
			} = {
				force: false,
				resetPage: false,
				resetParams: false,
			},
		) {
		}
	}

	// export class InitDefaultsFromCache {
	// 	public static readonly type: string = '[TODO] Not Implemented Yet!';
	// }
	//
	// export class ClearTableCache {
	// 	public static readonly type: string = '[TODO] Not Implemented Yet!';
	// }
	//
	// export class ClearItemCache {
	// 	public static readonly type: string = '[TODO] Not Implemented Yet!';
	// }
	//
	// export class ClearTableCacheAndGetList {
	// 	public static readonly type: string = '[TODO] Not Implemented Yet!';
	// }
	//
	// export class ClearItemCacheAndGetItem {
	// 	public static readonly type: string = '[TODO] Not Implemented Yet!';
	// }

	export class DeleteItem {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: string,
		) {
		}
	}

	export class ArchiveItem {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: string,
		) {
		}
	}

	export class GetItem {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: string,
		) {
		}
	}

	export class CreateItem<ITEM> {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: ITEM,
		) {
		}
	}

	export class UpdateItem<ITEM> {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: ITEM,
		) {
		}
	}

	// Updates of state

	export class UpdateFilters {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: Pick<ITableState<unknown>, 'filters'>,
		) {
		}
	}

	export class UpdateTableState<ITEM> {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: PITableState<ITEM>
		) {
		}
	}

}
