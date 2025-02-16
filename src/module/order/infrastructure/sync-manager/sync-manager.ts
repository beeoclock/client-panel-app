import {inject, Injectable, OnDestroy} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@order/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, Subject, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntil} from "rxjs/operators";
import {OrderRepository} from "@order/infrastructure/repository/order.repository";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import EOrder from "@core/business-logic/order/entity/e.order";

@Injectable()
export class SyncManager extends BaseSyncManager<IOrder.DTO, IOrder.Entity> implements OnDestroy {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(OrderRepository);
	protected readonly toEntity = EOrder.create;

	private readonly destroy$ = new Subject<void>();

	public constructor() {
		super('order');
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
