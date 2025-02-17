import {inject, Injectable, OnDestroy} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {EBusinessProfile} from "@core/business-logic/business-profile/entity/e.business-profile";
import {TENANT_ID} from "@src/token";
import {filter, Subject, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntil} from "rxjs/operators";
import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";
import {ApiDataProvider} from "@businessProfile/infrastructure/data-provider/api.data-provider";
import {BusinessProfileRepository} from "@businessProfile/infrastructure/repository/business-profile.repository";

@Injectable()
export class SyncManager extends BaseSyncManager<IBusinessProfile.DTO, IBusinessProfile.Entity> implements OnDestroy {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(BusinessProfileRepository);
	protected readonly toEntity = EBusinessProfile.create;

	private readonly destroy$ = new Subject<void>();

	public constructor() {
		super('businessProfile');
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
