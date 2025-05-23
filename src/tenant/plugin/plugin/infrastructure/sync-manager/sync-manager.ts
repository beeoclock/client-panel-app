import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IPlugin} from "@tenant/plugin/plugin/domain";
import {ApiDataProvider} from "@tenant/plugin/plugin/infrastructure/data-provider/api.data-provider";
import EPlugin from "@tenant/plugin/plugin/domain/entity/e.plugin-store";
import {PluginRepository} from "@tenant/plugin/plugin/infrastructure/repository/plugin.repository";

@Injectable()
export class SyncManager extends BaseSyncManager<IPlugin.DTO, EPlugin> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(PluginRepository);
	protected readonly toEntity = EPlugin.fromDTO;

	public constructor() {
		super('plugin');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
