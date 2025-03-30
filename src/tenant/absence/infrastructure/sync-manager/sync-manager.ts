import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {ApiDataProvider} from "@tenant/absence/infrastructure/data-provider/api.data-provider";
import {AbsenceRepository} from "@tenant/absence/infrastructure/repository/absence.repository";
import EAbsence from "@core/business-logic/absence/entity/e.absence";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class SyncManager extends BaseSyncManager<IAbsence.DTO, EAbsence> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(AbsenceRepository);
	protected readonly toEntity = EAbsence.fromDTO;

	public constructor() {
		super('absence');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
