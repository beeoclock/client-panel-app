import {inject, NgModule} from "@angular/core";
import {MemberRepository} from "@member/infrastructure/repository/member.repository";
import {ApiDataProvider} from "@member/infrastructure/data-provider/api.data-provider";
import {
	MemberIndexedDBDataProvider
} from "@member/infrastructure/data-provider/indexedDB/member.indexedDB.data-provider";
import {GetApi} from "@member/infrastructure/api/get.api";
import {PutApi} from "@member/infrastructure/api/put.api";
import {PostApi} from "@member/infrastructure/api/post.api";
import {
	MemberDexieAdapterIndexedDBDataProvider
} from "@member/infrastructure/data-provider/indexedDB/adapter/member.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@member/infrastructure/api/get-item.api";
import {MemberService} from "@core/business-logic/member/service/member.service";

@NgModule({
	providers: [

		// Api
		PostApi,
		GetApi,
		GetItemApi,
		PutApi,

		// Data Provider
		ApiDataProvider,
		MemberIndexedDBDataProvider,

		// Adapter
		MemberDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: MemberRepository,
			useFactory: () => new MemberRepository(
				new MemberIndexedDBDataProvider(),
			)
		},
		{
			provide: MemberService,
			useFactory: () => new MemberService(
				inject(MemberRepository),
			)
		},

		// Sync Manger
		SyncManager,

	]
})
export class MemberModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly memberService = inject(MemberService);

}
