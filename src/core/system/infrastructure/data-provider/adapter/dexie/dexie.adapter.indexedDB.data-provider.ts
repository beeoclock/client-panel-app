import Dexie from 'dexie';
import {IAdapterDataProvider} from "@core/system/interface/data-provider/i.adapter.data-provider";

export class TenantDB extends Dexie {
	constructor(
		public readonly tenant: string,
		public readonly moduleName: string,
		public readonly columns: string,
		version: number,
	) {
		super(`${tenant}-${moduleName}`);
		this.version(version).stores({
			items: columns,
		});
	}
}

export abstract class DexieAdapterIndexedDBDataProvider<Entity> implements IAdapterDataProvider<Entity> {

	private currentDatabase: TenantDB | undefined;
	private currentTenant: string | undefined;

	private readonly tenantDatabases = new Map<string, TenantDB>();

	protected abstract readonly columns: string;
	protected abstract readonly moduleName: string;
	protected abstract readonly version: number;

	/**
	 * The function prepares the table for the tenant in the database and sets it as the current table
	 * @param tenant
	 */
	public prepareTableFor(tenant: string) {

		if (this.currentTenant === tenant) {
			return;
		}
		this.currentTenant = tenant;

		this.currentDatabase = this.tenantDatabases.get(tenant);

		if (!this.currentDatabase) {
			this.currentDatabase = this.createDatabase(tenant);
		}

	}

	public get database() {
		return this.currentDatabase;
	}

	public get table() {
		return this.currentDatabase?.table('items');
	}

	public get tenant() {
		return this.currentTenant;
	}

	/**
	 * The function creates a table for the tenant in the database and returns it and prepare indexes for the table,
	 * if you need to create indexes, you can add them to the object passed to the stores method
	 * @param tenant
	 * @private
	 */
	private createDatabase(tenant: string) {
		const db = new TenantDB(tenant, this.moduleName, this.columns, this.version);
		this.tenantDatabases.set(tenant, db);
		return db;
	}

}
