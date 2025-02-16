import {inject, Injectable, OnDestroy} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {ApiDataProvider} from "@absence/infrastructure/data-provider/api.data-provider";
import {AbsenceRepository} from "@absence/infrastructure/repository/absence.repository";
import EAbsence from "@core/business-logic/absence/entity/e.absence";
import {TENANT_ID} from "@src/token";
import {takeUntil} from "rxjs/operators";
import {filter, Subject, tap} from "rxjs";
import {is} from "@core/shared/checker";

@Injectable()
export class SyncManager extends BaseSyncManager<IAbsence.DTO, IAbsence.Entity> implements OnDestroy {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(AbsenceRepository);
	protected readonly toEntity = EAbsence.create;

	private readonly destroy$ = new Subject<void>();

	public constructor() {
		super('absence');
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
