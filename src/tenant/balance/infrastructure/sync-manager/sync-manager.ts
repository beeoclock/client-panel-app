import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@tenant/balance/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IBalance} from "@tenant/balance/domain";
import EBalance from "@tenant/balance/domain/entity/e.balance";
import {BalanceRepository} from "@tenant/balance/infrastructure/repository/balance.repository";

@Injectable()
export class SyncManager extends BaseSyncManager<IBalance.DTO, EBalance> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(BalanceRepository);
	protected readonly toEntity = EBalance.fromDTO;

	public constructor() {
		super('balance');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
