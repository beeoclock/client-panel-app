import {Injectable} from '@angular/core';
import {TenantDatabase} from "@src/database/tenant/tenant.database";

@Injectable({
	providedIn: 'root',
})
export class TenantDatabaseService {

	#db!: TenantDatabase;

	/**
	 *
	 * @param tenantId
	 */
	public init(tenantId: string): void {
		this.#db = new TenantDatabase(tenantId);
	}

	public db() {
		return this.#db;
	}

}
