import Dexie from "dexie";
import {TenantDB} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";

export interface IAdapterDataProvider<Entity> {
	prepareTableFor(tenant: string): void;

	database: TenantDB | undefined;
	table: Dexie.Table<Entity> | undefined;
	tenant: string | undefined;
}
