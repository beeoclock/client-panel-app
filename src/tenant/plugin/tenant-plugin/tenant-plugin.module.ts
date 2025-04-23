import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/plugin/tenant-plugin/infrastructure/data-provider/api.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {NgxsModule} from "@ngxs/store";
import {
	PushChangesSyncManager
} from "@tenant/plugin/tenant-plugin/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {AllTenantPluginsApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/all-tenant-plugins.api";
import {DetachPluginApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/detach-plugin.api";
import {AttachPluginApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/attach-plugin.api";
import {ExecuteFunctionApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/execute-function.api";
import {TenantPluginRepository} from "@tenant/plugin/tenant-plugin/infrastructure/repository/tenant-plugin.repository";
import {
	TenantPluginIndexedDBDataProvider
} from "@tenant/plugin/tenant-plugin/infrastructure/data-provider/indexedDB/tenant-plugin.indexedDB.data-provider";
import {TenantPluginService} from "@tenant/plugin/tenant-plugin/domain/service/tenant-plugin.service";
import {TenantPluginDataState} from "@tenant/plugin/tenant-plugin/infrastructure/state/data/tenant-plugin.data.state";
import {
	TenantPluginPresentationState
} from "@tenant/plugin/tenant-plugin/infrastructure/state/presentation/tenant-plugin.presentation.state";
import {
	TenantPluginDexieAdapterIndexedDBDataProvider
} from "@tenant/plugin/tenant-plugin/infrastructure/data-provider/indexedDB/adapter/tenant-plugin.dexie.adapter.indexedDB.data-provider";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			TenantPluginDataState,
			TenantPluginPresentationState,
		]),
	],
	providers: [

		// Api
		AllTenantPluginsApi,
		AttachPluginApi,
		DetachPluginApi,
		ExecuteFunctionApi,

		// Data Provider
		ApiDataProvider,
		TenantPluginIndexedDBDataProvider,

		// Adapter
		TenantPluginDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: TenantPluginRepository,
			useFactory: () => {
				const dataProvider = inject(TenantPluginIndexedDBDataProvider);
				const repository = new TenantPluginRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: TenantPluginService,
			useFactory: () => {
				const repository = inject(TenantPluginRepository);
				const service = new TenantPluginService();
				service.repository = repository;
				service.initDbHandler();
				return service;
			},
		},

		// Sync Manger
		SyncManager,

		{
			provide: PushChangesSyncManager,
			useFactory: () => new PushChangesSyncManager(
				inject(TenantPluginIndexedDBDataProvider),
			),
		},

	]
})
export class TenantPluginModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly tenantPluginService = inject(TenantPluginService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.tenantPlugin = this.tenantPluginService;
	}

}
