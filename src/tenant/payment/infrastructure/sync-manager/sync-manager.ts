import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@tenant/payment/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {PaymentRepository} from "@tenant/payment/infrastructure/repository/payment.repository";
import EPayment from "@core/business-logic/payment/entity/e.payment";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class SyncManager extends BaseSyncManager<IPayment.DTO, EPayment> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(PaymentRepository);
	protected readonly toEntity = EPayment.fromDTO;

	public constructor() {
		super('payment');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
