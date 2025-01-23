import {inject, Injectable} from '@angular/core';
import {CustomerTenantDatabaseService} from "@customer/database/tenant/customer.tenant.database.service";
import {ILocalEntity, LocalEntity} from "@src/database/tenant/tenant.database";
import {ICustomer} from "@customer/domain";
import {CreateCustomerApiAdapter} from "@customer/adapter/external/api/create.customer.api.adapter";
import {UpdateCustomerApiAdapter} from "@customer/adapter/external/api/update.customer.api.adapter";
import {RemoveCustomerApiAdapter} from "@customer/adapter/external/api/remove.customer.api.adapter";
import {ListCustomerApiAdapter} from "@customer/adapter/external/api/list.customer.api.adapter";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";


@Injectable({
    providedIn: 'root',
})
export class SyncCustomerTenantDatabaseService {

    private readonly customerTenantDatabaseService = inject(CustomerTenantDatabaseService);

    private readonly create = inject(CreateCustomerApiAdapter);
    private readonly update = inject(UpdateCustomerApiAdapter);
    private readonly delete = inject(RemoveCustomerApiAdapter);
    private readonly paged = inject(ListCustomerApiAdapter);

    public store() {
        return this.customerTenantDatabaseService.store();
    }

    public async execute() {

        try {
            // 1. Відправляємо нові записи
            const newRecords = await this.store().where('syncedAt').equals('').toArray();
            for (const record of newRecords) {
                await this.syncNewRecord(record);
            }

            // 2. Відправляємо змінені записи
            const updatedRecords = await this.store().filter(record => {
                return !!(record.syncedAt && new Date(record.data.updatedAt) > new Date(record.syncedAt));
            }).toArray();
            for (const record of updatedRecords) {
                await this.syncUpdatedRecord(record);
            }

            // 3. Видаляємо записи, позначені для видалення
            const deletedRecords = await this.store().where('deletedAt').notEqual('').toArray();
            for (const record of deletedRecords) {
                await this.syncDeletedRecord(record);
            }

            // 4. Завантажуємо оновлення з сервера
            // const lastSyncTime = await this.getLastSyncTime();
            // const updatedRecordsFromServer = await this.apiService.getUpdatedCustomers(lastSyncTime);

            let page = 1; // Починаємо з першої сторінки
            let hasMore = true; // Флаг для перевірки, чи є ще сторінки

            while (hasMore) {
                // Виконання запиту на поточну сторінку
                const updatedRecordsFromServer = await this.paged.executeAsync({
                    orderBy: OrderByEnum.UPDATED_AT,
                    orderDir: OrderDirEnum.DESC,
                    pageSize: 5,
                    page: page,
                });

                // Синхронізація кожного запису з сервера
                for (const serverRecord of updatedRecordsFromServer.items) {
                    await this.syncFromServer(serverRecord);
                }

                // Якщо отримано менше записів, ніж pageSize, значить, це була остання сторінка
                hasMore = updatedRecordsFromServer.items.length === 5;
                page++; // Переходимо до наступної сторінки
            }

            console.log('Synchronization completed successfully');
        } catch (error) {
            console.error('Synchronization failed:', error);
        }


    }


    private async syncNewRecord(record: ILocalEntity<ICustomer>): Promise<void> {
        try {
            // const response = await this.apiService.createCustomer(record.data);
            await this.create.executeAsync(record.data);
            record.syncedAt = new Date().toISOString();
            await this.store().put(record);
        } catch (error) {
            console.error('Failed to sync new record:', record, error);
        }
    }

    private async syncUpdatedRecord(record: ILocalEntity<ICustomer>): Promise<void> {
        try {
            // await this.apiService.updateCustomer(record.data);
            await this.update.executeAsync(record.data);
            record.syncedAt = new Date().toISOString();
            await this.store().put(record);
        } catch (error) {
            console.error('Failed to sync updated record:', record, error);
        }
    }

    private async syncDeletedRecord(record: ILocalEntity<ICustomer>): Promise<void> {
        try {
            // await this.apiService.deleteCustomer(record._id);
            await this.delete.executeAsync(record._id);
            await this.store().delete(record._id);
        } catch (error) {
            console.error('Failed to sync deleted record:', record, error);
        }
    }

    private async syncFromServer(serverRecord: ICustomer): Promise<void> {
        const localRecord = await this.store().get(serverRecord._id);
        if (!localRecord) {
            // Новий запис на сервері
            const newRecord = LocalEntity.create(serverRecord, new Date().toISOString());
            await this.store().add(newRecord);
        } else if (new Date(serverRecord.updatedAt) > new Date(localRecord.data.updatedAt)) {
            // Серверні дані новіші
            localRecord.data = serverRecord;
            localRecord.syncedAt = new Date().toISOString();
            await this.store().put(localRecord);
        }
    }

    // private async getLastSyncTime(): Promise<string> {
    //     const records = await this.store().toArray();
    //     const lastSyncTimes = records.map(record => record.syncedAt).filter(Boolean) as string[];
    //     return lastSyncTimes.length ? new Date(Math.max(...lastSyncTimes.map(date => new Date(date).getTime()))).toISOString() : '1970-01-01T00:00:00.000Z';
    // }

}
