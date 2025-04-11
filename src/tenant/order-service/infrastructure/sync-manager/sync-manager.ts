import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@tenant/order-service/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {OrderServiceRepository} from "@tenant/order-service/infrastructure/repository/order-service.repository";
import EOrderService from "@tenant/order-service/domain/entity/e.order-service";
import {IOrderService} from "@tenant/order-service/domain/interface/i.order-service.dto";

@Injectable()
export class SyncManager extends BaseSyncManager<IOrderService.DTO, EOrderService> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(OrderServiceRepository);
	protected readonly toEntity = EOrderService.fromDTO;

	public constructor() {
		super('orderService');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
