import Dexie from "dexie";

export interface IAdapterDataProvider<Entity> {
	prepareTableFor(tenant: string): void;

	table: Dexie.Table<Entity> | undefined;
	tenant: string | undefined;
}
