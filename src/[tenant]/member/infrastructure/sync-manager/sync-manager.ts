import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@[tenant]/member/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {IMember} from "@core/business-logic/member/interface/i.member";
import EMember from "@core/business-logic/member/entity/e.member";
import {MemberRepository} from "@[tenant]/member/infrastructure/repository/member.repository";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class SyncManager extends BaseSyncManager<IMember.DTO, EMember> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(MemberRepository);
	protected readonly toEntity = EMember.fromDTO;

	public constructor() {
		super('member');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
