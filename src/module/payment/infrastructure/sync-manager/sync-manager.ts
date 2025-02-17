import {inject, Injectable, OnDestroy} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@payment/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, Subject, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntil} from "rxjs/operators";
import {PaymentRepository} from "@payment/infrastructure/repository/payment.repository";
import EPayment from "@core/business-logic/payment/entity/e.payment";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";

@Injectable()
export class SyncManager extends BaseSyncManager<IPayment.DTO, IPayment.Entity> implements OnDestroy {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(PaymentRepository);
	protected readonly toEntity = EPayment.create;

	private readonly destroy$ = new Subject<void>();

	public constructor() {
		super('payment');
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
