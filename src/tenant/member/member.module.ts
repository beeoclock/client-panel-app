import {inject, NgModule} from "@angular/core";
import {MemberRepository} from "@tenant/member/infrastructure/repository/member.repository";
import {ApiDataProvider} from "@tenant/member/infrastructure/data-provider/api.data-provider";
import {
	MemberIndexedDBDataProvider
} from "@tenant/member/infrastructure/data-provider/indexedDB/member.indexedDB.data-provider";
import {GetApi} from "@tenant/member/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/member/infrastructure/data-source/api/put.api";
import {PostApi} from "@tenant/member/infrastructure/data-source/api/post.api";
import {
	MemberDexieAdapterIndexedDBDataProvider
} from "@tenant/member/infrastructure/data-provider/indexedDB/adapter/member.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tenant/member/infrastructure/data-source/api/get-item.api";
import {MemberService} from "@tenant/member/domain/service/member.service";
import {NgxsModule} from "@ngxs/store";
import {PushChangesSyncManager} from "@tenant/member/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {MemberDataState} from "@tenant/member/infrastructure/state/data/member.data.state";
import {MemberPresentationState} from "@tenant/member/infrastructure/state/presentation/member.presentation.state";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			MemberDataState,
			MemberPresentationState,
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
