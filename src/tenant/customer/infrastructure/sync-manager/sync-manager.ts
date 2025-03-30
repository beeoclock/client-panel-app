import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@tenant/customer/infrastructure/data-provider/api.data-provider";
import {CustomerRepository} from "@tenant/customer/infrastructure/repository/customer.repository";
import EAbsence, {ECustomer} from "@tenant/customer/domain/entity/e.customer";
import {ICustomer} from "@tenant/customer/domain";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class SyncManager extends BaseSyncManager<ICustomer.DTO, ECustomer> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(CustomerRepository);
	protected readonly toEntity = EAbsence.fromDTO;

	public constructor() {
		super('customer');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
