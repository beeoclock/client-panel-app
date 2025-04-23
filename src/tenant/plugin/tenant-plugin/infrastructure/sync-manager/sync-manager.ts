import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";
import {TenantPluginRepository} from "@tenant/plugin/tenant-plugin/infrastructure/repository/tenant-plugin.repository";
import {ITenantPlugin} from "@tenant/plugin/tenant-plugin/domain";
import {ApiDataProvider} from "../data-provider/api.data-provider";

@Injectable()
export class SyncManager extends BaseSyncManager<ITenantPlugin.DTO, ETenantPlugin> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(TenantPluginRepository);
	protected readonly toEntity = ETenantPlugin.fromDTO;

	public constructor() {
		super('tenantPlugin');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
