import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@customer/infrastructure/data-provider/api.data-provider";
import {CustomerRepository} from "@customer/infrastructure/repository/customer.repository";
import EAbsence from "@core/business-logic/customer/entity/e.customer";
import {ICustomer} from "@core/business-logic/customer";

@Injectable()
export class SyncManager extends BaseSyncManager<ICustomer.DTO, ICustomer.Entity> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(CustomerRepository);
	protected readonly toEntity = EAbsence.create;

	public constructor() {
		super('customer');
	}

}
