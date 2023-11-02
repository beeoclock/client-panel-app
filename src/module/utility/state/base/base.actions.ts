import {ITableState} from "@utility/domain/table.state";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BaseActions {

	export abstract class Init {
		public static readonly type: string = '[TODO] Not Implemented Yet!';
	}

	export abstract class GetList {
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

	export abstract class InitDefaultsFromCache {
		public static readonly type: string = '[TODO] Not Implemented Yet!';
	}

	export abstract class ClearTableCache {
		public static readonly type: string = '[TODO] Not Implemented Yet!';
	}

	export abstract class ClearItemCache {
		public static readonly type: string = '[TODO] Not Implemented Yet!';
	}

	export abstract class ClearTableCacheAndGetList {
		public static readonly type: string = '[TODO] Not Implemented Yet!';
	}

	export abstract class ClearItemCacheAndGetItem {
		public static readonly type: string = '[TODO] Not Implemented Yet!';
	}

	export abstract class DeleteItem {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: string,
		) {
		}
	}

	export abstract class ArchiveItem {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: string,
		) {
		}
	}

	export abstract class GetItem {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: string,
		) {
		}
	}

	export abstract class CreateItem<ITEM> {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: ITEM,
		) {
		}
	}

	export abstract class UpdateItem<ITEM> {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: ITEM,
		) {
		}
	}

	// Updates of state

	export abstract class UpdateFilters {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: Pick<ITableState<any>, 'filters'>,
		) {
		}
	}

	export abstract class UpdateTableState<ITEM> {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: ITableState<ITEM>
		) {
		}
	}

}
