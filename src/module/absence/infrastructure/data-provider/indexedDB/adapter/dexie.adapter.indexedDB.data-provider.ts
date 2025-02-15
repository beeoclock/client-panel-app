import Dexie from 'dexie';
import {Injectable} from '@angular/core';
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";

@Injectable()
export class DexieAdapterIndexedDBDataProvider {

	private readonly dexie: Dexie;
	private readonly tables = new Map<string, Dexie.Table<IAbsence.Entity>>();
	private readonly version = 1;
	private currentTable: Dexie.Table<IAbsence.Entity> | undefined;
	private currentTenant: string | undefined;

	public constructor() {
		// TODO: Select strategy: database per tenant or table per tenant
		// TODO: Find way to inject the database name if database per tenant strategy is selected
		// TODO: Find way to inject the table name if table per tenant strategy is selected
		// For a while we will use the table per tenant strategy
		this.dexie = new Dexie('absence');
	}

	/**
	 * The function prepares the table for the tenant in the database and sets it as the current table
	 * @param tenant
	 */
	public prepareTableFor(tenant: string) {
		console.log('DexieAdapterIndexedDBDataProvider:prepareTableFor', {tenant}, this);
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
			[tenant]: '_id,createdAt,updatedAt,start,end',
		});
		return this.dexie.table<IAbsence.Entity>(tenant);
	}

}
