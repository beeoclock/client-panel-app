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
import {NgxsModule} from "@ngxs/store";
import {MemberState} from "@member/infrastructure/state/member/member.state";
import {PushChangesSyncManager} from "@member/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			MemberState,
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
		MemberIndexedDBDataProvider,

		// Adapter
		MemberDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: MemberRepository,
			useFactory: () => {
				const dataProvider = inject(MemberIndexedDBDataProvider);
				const repository = new MemberRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: MemberService,
			useFactory: () => {
				const repository = inject(MemberRepository);
				const service = new MemberService();
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
				inject(MemberIndexedDBDataProvider),
			),
		},

	]
})
export class MemberModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly memberService = inject(MemberService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.member = this.memberService;
	}

}
