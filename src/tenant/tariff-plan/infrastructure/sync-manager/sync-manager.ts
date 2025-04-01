import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@tenant/tariff-plan/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TariffPlanRepository} from "@tenant/tariff-plan/infrastructure/repository/tariff-plan.repository";
import ETariffPlan from "@tenant/tariff-plan/domain/entity/e.tariff-plan";
import {ITariffPlan} from "@tenant/tariff-plan/domain/interface/i.tariff-plan";

@Injectable()
export class SyncManager extends BaseSyncManager<ITariffPlan.DTO, ETariffPlan> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(TariffPlanRepository);
	protected readonly toEntity = ETariffPlan.fromDTO;

	public constructor() {
		super('tariff-plan');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
