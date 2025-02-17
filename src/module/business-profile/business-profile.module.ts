import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@businessProfile/infrastructure/data-provider/api.data-provider";
import {SyncManager} from "@businessProfile/infrastructure/sync-manager/sync-manager";
import {NgxsModule} from "@ngxs/store";
import {BusinessProfileService} from "@core/business-logic/business-profile/service/business-profile.service";
import {
	BusinessProfileIndexedDBDataProvider
} from "@businessProfile/infrastructure/data-provider/indexedDB/business-profile.indexedDB.data-provider";
import {GetApi} from "@businessProfile/infrastructure/api/get.api";
import {PutApi} from "@businessProfile/infrastructure/api/put.api";
import {
	BusinessProfileDexieAdapterIndexedDBDataProvider
} from "@businessProfile/infrastructure/data-provider/indexedDB/adapter/business-profile.dexie.adapter.indexedDB.data-provider";
import {BusinessProfileRepository} from "@businessProfile/infrastructure/repository/business-profile.repository";
import {BusinessProfileState} from "@businessProfile/infrastructure/state/business-profile/business-profile.state";

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
			useFactory: () => new BusinessProfileRepository(
				inject(BusinessProfileIndexedDBDataProvider),
			)
		},
		{
			provide: BusinessProfileService,
			useFactory: () => new BusinessProfileService(
				inject(BusinessProfileRepository),
			)
		},

		// Sync Manger
		SyncManager,

	]
})
export class BusinessProfileModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly businessProfileService = inject(BusinessProfileService);

}
