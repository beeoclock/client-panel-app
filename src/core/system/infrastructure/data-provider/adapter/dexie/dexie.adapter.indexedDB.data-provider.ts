import Dexie from 'dexie';
import {IAdapterDataProvider} from "@core/system/interface/data-provider/i.adapter.data-provider";

export abstract class DexieAdapterIndexedDBDataProvider<Entity> implements IAdapterDataProvider<Entity> {

	private readonly dexie: Dexie;
	private readonly tables = new Map<string, Dexie.Table<Entity>>();
	private currentTable: Dexie.Table<Entity> | undefined;
	private currentTenant: string | undefined;

	protected constructor(
		protected readonly columns: string,
		protected readonly name: string,
		protected readonly version: number,
	) {
		// TODO: Select strategy: database per tenant or table per tenant
		// TODO: Find way to inject the database name if database per tenant strategy is selected
		// TODO: Find way to inject the table name if table per tenant strategy is selected
		// For a while we will use the table per tenant strategy
		this.dexie = new Dexie(this.name);
	}

	/**
	 * The function prepares the table for the tenant in the database and sets it as the current table
	 * @param tenant
	 */
	public prepareTableFor(tenant: string) {
		if (this.currentTenant === tenant) {
			return;
		}
		this.currentTenant = tenant;
		this.currentTable = this.tables.get(tenant) || this.createTableFor(tenant);
		this.tables.set(this.currentTenant, this.currentTable);
	}

	public get table() {
		return this.currentTable;
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
	private createTableFor(tenant: string) {
		this.dexie.version(this.version).stores({
			[tenant]: this.columns,
		});
		return this.dexie.table<Entity>(tenant);
	}

}
