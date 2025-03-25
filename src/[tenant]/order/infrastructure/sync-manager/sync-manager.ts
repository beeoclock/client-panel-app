import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@[tenant]/order/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {OrderRepository} from "@[tenant]/order/infrastructure/repository/order.repository";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import EOrder from "@core/business-logic/order/entity/e.order";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class SyncManager extends BaseSyncManager<IOrder.DTO, EOrder> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(OrderRepository);
	protected readonly toEntity = EOrder.fromDTO;

	public constructor() {
		super('order');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
