import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {EBusinessProfile} from "@tenant/business-profile/domain/entity/e.business-profile";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {IBusinessProfile} from "@tenant/business-profile/domain/interface/i.business-profile";
import {ApiDataProvider} from "@tenant/business-profile/infrastructure/data-provider/api.data-provider";
import {
	BusinessProfileRepository
} from "@tenant/business-profile/infrastructure/repository/business-profile.repository";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class SyncManager extends BaseSyncManager<IBusinessProfile.DTO, EBusinessProfile> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(BusinessProfileRepository);
	protected readonly toEntity = EBusinessProfile.fromDTO;


	public constructor() {
		super('business-profile');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
