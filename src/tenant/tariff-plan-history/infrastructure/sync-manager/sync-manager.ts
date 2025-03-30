import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@tenant/tariff-plan-history/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {
	TariffPlanHistoryRepository
} from "@tenant/tariff-plan-history/infrastructure/repository/tariff-plan-history.repository";
import {ITariffPlanHistory} from "@core/business-logic/tariif-plan-history/interface/i.tariff-plan-history";
import ETariffPlanHistory from "@core/business-logic/tariif-plan-history/entity/e.tariff-plan-history";

@Injectable()
export class SyncManager extends BaseSyncManager<ITariffPlanHistory.DTO, ETariffPlanHistory> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(TariffPlanHistoryRepository);
	protected readonly toEntity = ETariffPlanHistory.fromDTO;

	public constructor() {
		super('tariff-plan-history');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
