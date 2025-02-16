import {inject, Injectable, OnDestroy} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@customer/infrastructure/data-provider/api.data-provider";
import {CustomerRepository} from "@customer/infrastructure/repository/customer.repository";
import EAbsence from "@core/business-logic/customer/entity/e.customer";
import {ICustomer} from "@core/business-logic/customer";
import {TENANT_ID} from "@src/token";
import {filter, Subject, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntil} from "rxjs/operators";

@Injectable()
export class SyncManager extends BaseSyncManager<ICustomer.DTO, ICustomer.Entity> implements OnDestroy {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(CustomerRepository);
	protected readonly toEntity = EAbsence.create;

	private readonly destroy$ = new Subject<void>();

	public constructor() {
		super('customer');
		inject(TENANT_ID).pipe(
			takeUntil(this.destroy$),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
