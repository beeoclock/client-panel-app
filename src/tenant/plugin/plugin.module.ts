import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/plugin/infrastructure/data-provider/api.data-provider";
import {GetApi} from "@tenant/plugin/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/plugin/infrastructure/data-source/api/put.api";
import {PostApi} from "@tenant/plugin/infrastructure/data-source/api/post.api";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tenant/plugin/infrastructure/data-source/api/get-item.api";
import {NgxsModule} from "@ngxs/store";
import {PushChangesSyncManager} from "@tenant/plugin/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {PluginDataState} from "@tenant/plugin/infrastructure/state/data/plugin.data.state";
import {PluginPresentationState} from "@tenant/plugin/infrastructure/state/presentation/plugin.presentation.state";
import {
	PluginIndexedDBDataProvider
} from "@tenant/plugin/infrastructure/data-provider/indexedDB/plugin.indexedDB.data-provider";
import {
	PluginDexieAdapterIndexedDBDataProvider
} from "@tenant/plugin/infrastructure/data-provider/indexedDB/adapter/plugin.dexie.adapter.indexedDB.data-provider";
import {PluginService} from "@tenant/plugin/domain/service/plugin.service";
import {PluginRepository} from "@tenant/plugin/infrastructure/repository/plugin.repository";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			PluginDataState,
			PluginPresentationState,
		]),
	],
	providers: [

		// Api
		PostApi,
		GetApi,
		GetItemApi,
		PutApi,

		// Data Provider
		ApiDataProvider,
		PluginIndexedDBDataProvider,

		// Adapter
		PluginDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: PluginRepository,
			useFactory: () => {
				const dataProvider = inject(PluginIndexedDBDataProvider);
				const repository = new PluginRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: PluginService,
			useFactory: () => {
				const repository = inject(PluginRepository);
				const service = new PluginService();
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
				inject(PluginIndexedDBDataProvider),
			),
		},

	]
})
export class PluginModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly pluginService = inject(PluginService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.plugin = this.pluginService;
	}

}
