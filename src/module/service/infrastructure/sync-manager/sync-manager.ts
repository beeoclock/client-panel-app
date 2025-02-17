import {inject, Injectable, OnDestroy} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@service/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, Subject, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntil} from "rxjs/operators";
import {ServiceRepository} from "@service/infrastructure/repository/service.repository";
import {IService} from "@core/business-logic/service/interface/i.service";
import EService from "@core/business-logic/service/entity/e.service";

@Injectable()
export class SyncManager extends BaseSyncManager<IService.DTO, IService.Entity> implements OnDestroy {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(ServiceRepository);
	protected readonly toEntity = EService.create;

	private readonly destroy$ = new Subject<void>();

	public constructor() {
		super('service');
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
