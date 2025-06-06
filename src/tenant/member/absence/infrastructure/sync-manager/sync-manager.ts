import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";
import {ApiDataProvider} from "@tenant/member/absence/infrastructure/data-provider/api.data-provider";
import {AbsenceRepository} from "@tenant/member/absence/infrastructure/repository/absence.repository";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
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
