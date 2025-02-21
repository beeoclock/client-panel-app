import {inject, Injectable, OnDestroy} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@member/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, Subject, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntil} from "rxjs/operators";
import {IMember} from "@core/business-logic/member/interface/i.member";
import EMember from "@core/business-logic/member/entity/e.member";
import {MemberRepository} from "@member/infrastructure/repository/member.repository";

@Injectable()
export class SyncManager extends BaseSyncManager<IMember.DTO, EMember> implements OnDestroy {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(MemberRepository);
	protected readonly toEntity = EMember.fromDTO;

	private readonly destroy$ = new Subject<void>();

	public constructor() {
		super('member');
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
