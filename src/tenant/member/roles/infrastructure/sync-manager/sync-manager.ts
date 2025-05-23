import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@tenant/member/roles/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IRole} from "@tenant/member/roles/domain";
import ERole from "@tenant/member/roles/domain/entity/e.role";
import {RoleRepository} from "@tenant/member/roles/infrastructure/repository/role.repository";

@Injectable()
export class SyncManager extends BaseSyncManager<IRole.DTO, ERole> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(RoleRepository);
	protected readonly toEntity = ERole.fromDTO;

	public constructor() {
		super('role');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
