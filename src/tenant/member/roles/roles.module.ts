import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/member/roles/infrastructure/data-provider/api.data-provider";

import {GetApi} from "@tenant/member/roles/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/member/roles/infrastructure/data-source/api/put.api";
import {PostApi} from "@tenant/member/roles/infrastructure/data-source/api/post.api";

import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tenant/member/roles/infrastructure/data-source/api/get-item.api";
import {NgxsModule} from "@ngxs/store";
import {PushChangesSyncManager} from "@tenant/member/roles/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {RoleDataState} from "@tenant/member/roles/infrastructure/state/data/role.data.state";
import {
	RolePresentationState
} from "@tenant/member/roles/infrastructure/state/presentation/role.presentation.state";
import {RoleService} from "@tenant/member/roles/domain/service/role.service";
import {
	RoleIndexedDBDataProvider
} from "@tenant/member/roles/infrastructure/data-provider/indexedDB/role.indexedDB.data-provider";
import {
	RoleDexieAdapterIndexedDBDataProvider
} from "@tenant/member/roles/infrastructure/data-provider/indexedDB/adapter/role.dexie.adapter.indexedDB.data-provider";
import {RoleRepository} from "@tenant/member/roles/infrastructure/repository/role.repository";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			RoleDataState,
			RolePresentationState,
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
		RoleIndexedDBDataProvider ,

		// Adapter
		RoleDexieAdapterIndexedDBDataProvider      ,

		// Repository
		{
			provide: RoleRepository,
			useFactory: () => {
				const dataProvider = inject(RoleIndexedDBDataProvider);
				const repository = new RoleRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: RoleService,
			useFactory: () => {
				const repository = inject(RoleRepository);
				const service = new RoleService();
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
				inject(RoleIndexedDBDataProvider),
			),
		},

	]
})
export class RolesModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly roleService = inject(RoleService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.role = this.roleService;
	}

}
