import {inject, Injectable} from '@angular/core';
import {ILocalEntity, LocalEntity} from "@src/database/tenant/tenant.database";
import {ICustomer} from "@customer/domain";
import {TenantDatabaseService} from "@src/database/tenant/tenant.database.service";

type DATA = ICustomer;

@Injectable({
	providedIn: 'root',
})
export class CustomerTenantDatabaseService {

	public static readonly storeName = 'customer';

	private readonly tenantDatabaseService = inject(TenantDatabaseService);

	public db() {
		return this.tenantDatabaseService.db();
	}

	public store() {
		return this.db()[CustomerTenantDatabaseService.storeName];
	}

	public async getAll(): Promise<ILocalEntity<DATA>[]> {
		return this.store().toArray();
	}

	public async get(_id: string): Promise<ILocalEntity<DATA> | undefined> {
		return this.store().get(_id);
	}

	/**
	 *
	 * @param data
	 */
	public async add(data: DATA): Promise<void> {
		const entity = LocalEntity.create(data);
		await this.store().add(entity);
	}

	/**
	 * Оновлення даних користувача
	 * @param _id
	 * @param data
	 */
	public async update(_id: string, data: Partial<DATA>): Promise<void> {

		const existing = await this.store().get(_id);

		if (!existing) throw new Error(`${CustomerTenantDatabaseService.storeName} not found`);

		const updatedEntity = {
			...existing,
			data: {
				...existing.data,
				...data
			}
		};

		await this.store().put(updatedEntity);

	}

	/**
	 * Збереження користувача
	 * @param entity
	 */
	public async put(entity: LocalEntity<DATA>): Promise<void> {

		try {

			await this.store().put(entity);

		} catch (error) {

			console.error({error}, {entity});

		}

	}

	/**
	 * Видалення користувача
	 * @param _id
	 */
	public async delete(_id: string): Promise<void> {
		const existing = await this.store().get(_id);

		if (!existing) throw new Error(`${CustomerTenantDatabaseService.storeName} not found`);

		existing.deletedAt = new Date().toISOString();

		await this.store().put(existing);

	}

}
