import {Types} from "@core/shared/types";

export interface ISyncState {
	options: Types.StandardQueryParams;
	progress: {
		total: number;
		current: number;
		percentage: number;
	};
	lastStartSync: string;
	lastSuccessSyncItemAt: string | null;
}

export interface ISyncManger {
	readonly moduleName: string;
	readonly tenantId: string;

	isSyncing: number;

	resume(): Promise<void>;

	sync(): Promise<void>;

	syncState: ISyncState | null;

	initSyncState(): void;

	initPullData(): Promise<boolean>;

	initPushData(): Promise<void>;

	doPull(): Promise<void>;

	doPush(): Promise<void>;

	setTenantId(tenantId: string): void;
}

export interface SyncStates {
	[moduleName: string]: {
		[tenant: string]: ISyncState;
	};
}
