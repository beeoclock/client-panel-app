import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/business-profile/infrastructure/data-provider/api.data-provider";
import {SyncManager} from "@tenant/business-profile/infrastructure/sync-manager/sync-manager";
import {NgxsModule} from "@ngxs/store";
import {BusinessProfileService} from "@core/business-logic/business-profile/service/business-profile.service";
import {
	BusinessProfileIndexedDBDataProvider
} from "@tenant/business-profile/infrastructure/data-provider/indexedDB/business-profile.indexedDB.data-provider";
import {GetApi} from "@tenant/business-profile/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/business-profile/infrastructure/data-source/api/put.api";
import {
	BusinessProfileDexieAdapterIndexedDBDataProvider
} from "@tenant/business-profile/infrastructure/data-provider/indexedDB/adapter/business-profile.dexie.adapter.indexedDB.data-provider";
import {
	BusinessProfileRepository
} from "@tenant/business-profile/infrastructure/repository/business-profile.repository";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {PushChangesSyncManager} from "@tenant/business-profile/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			BusinessProfileState,
		]),
	],
	providers: [

		// Api
		GetApi.Request,
		PutApi,

		// Data Provider
		ApiDataProvider,
		BusinessProfileIndexedDBDataProvider,

		// Adapter
		BusinessProfileDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: BusinessProfileRepository,
			useFactory: () => {
				const dataProvider = inject(BusinessProfileIndexedDBDataProvider);
				const repository = new BusinessProfileRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: BusinessProfileService,
			useFactory: () => {
				const repository = inject(BusinessProfileRepository);
				const service = new BusinessProfileService();
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
				inject(BusinessProfileIndexedDBDataProvider),
			),
		},

	]
})
export class BusinessProfileModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly businessProfileService = inject(BusinessProfileService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.businessProfile = this.businessProfileService;
	}

}
