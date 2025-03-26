import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@[tenant]/service/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {ServiceRepository} from "@[tenant]/service/infrastructure/repository/service.repository";
import {IService} from "@core/business-logic/service/interface/i.service";
import EService from "@core/business-logic/service/entity/e.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class SyncManager extends BaseSyncManager<IService.DTO, EService> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(ServiceRepository);
	protected readonly toEntity = EService.fromDTO;

	public constructor() {
		super('service');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
