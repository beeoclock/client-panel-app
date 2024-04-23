import {ITableState, PITableState} from "@utility/domain/table.state";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BaseActions {

	// Application layer

	export class CloseDetails {
		public static readonly type: string = '[Base Application] Close Details';
	}

	export class CloseForm {
		public static readonly type: string = '[Base Application] Close Form';
	}

	export class OpenDetailsById {
		public static readonly type: string = '[Base Application] Open Details By Id';

		constructor(
			public readonly payload: string,
		) {
		}
	}

	export class OpenFormToEditById {
		public static readonly type: string = '[Base Application] Open Form To Edit By Id';

		constructor(
			public readonly payload: string,
		) {
		}
	}

	export class OpenForm<PAYLOAD> {
		public static readonly type: string = '[Base Application] Open Form';

		constructor(
			public readonly payload?: PAYLOAD,
		) {
		}
	}

	// API

	export class Init {
		public static readonly type: string = '[TODO] Not Implemented Yet!';
	}

	export class GetList {
		public static readonly type: string = '[TODO] Not Implemented Yet!';

		constructor(
			public readonly payload: {
				resetPage: boolean;
				resetParams: boolean;
			} = {
				resetPage: false,
				resetParams: false,
			},
		) {
		}
	}

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

	export class UnarchiveItem {
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
