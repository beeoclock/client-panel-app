import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/product/product-tag/infrastructure/data-provider/api.data-provider";
import {SyncManager} from "@tenant/product/product-tag/infrastructure/sync-manager/sync-manager";
import {NgxsModule} from "@ngxs/store";
import {PushChangesSyncManager} from "@tenant/product/product-tag/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	ArchiveProductTagApiAdapter
} from "@tenant/product/product-tag/infrastructure/data-source/api/archive.product-tag.api.adapter";
import {
	CreateProductTagApiAdapter
} from "@tenant/product/product-tag/infrastructure/data-source/api/create.product-tag.api.adapter";
import {
	DeleteProductTagApiAdapter
} from "@tenant/product/product-tag/infrastructure/data-source/api/delete.product-tag.api.adapter";
import {
	ItemProductTagApiAdapter
} from "@tenant/product/product-tag/infrastructure/data-source/api/item.product-tag.api.adapter";
import {
	UnarchiveProductTagApiAdapter
} from "@tenant/product/product-tag/infrastructure/data-source/api/unarchive.product-tag.api.adapter";
import {
	UpdateProductTagApiAdapter
} from "@tenant/product/product-tag/infrastructure/data-source/api/update.product-tag.api.adapter";
import {
	ProductTagIndexedDBDataProvider
} from "@tenant/product/product-tag/infrastructure/data-provider/indexedDB/product-tag.indexedDB.data-provider";
import {
	ProductTagDexieAdapterIndexedDBDataProvider
} from "@tenant/product/product-tag/infrastructure/data-provider/indexedDB/adapter/product-tag.dexie.adapter.indexedDB.data-provider";
import {ProductTagRepository} from "@tenant/product/product-tag/infrastructure/repository/product-tag.repository";
import {ProductTagService} from "@tenant/product/product-tag/domain/service/product-tag.service";
import {
	ListProductTagApiAdapter
} from "@tenant/product/product-tag/infrastructure/data-source/api/list.product-tag.api.adapter";
import {
	ProductTagPresentationState
} from "@tenant/product/product-tag/infrastructure/state/presentation/product-tag.presentation.state";
import {ProductTagDataState} from "@tenant/product/product-tag/infrastructure/state/data/product-tag.data.state";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			ProductTagDataState,
			ProductTagPresentationState,
		]),
	],
	providers: [

		// Api
		ArchiveProductTagApiAdapter,
		CreateProductTagApiAdapter,
		DeleteProductTagApiAdapter,
		ItemProductTagApiAdapter,
		UnarchiveProductTagApiAdapter,
		UpdateProductTagApiAdapter,
		ListProductTagApiAdapter,

		// Data Provider
		ApiDataProvider,
		ProductTagIndexedDBDataProvider,

		// Adapter
		ProductTagDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: ProductTagRepository,
			useFactory: () => {
				const dataProvider = inject(ProductTagIndexedDBDataProvider);
				const repository = new ProductTagRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: ProductTagService,
			useFactory: () => {
				const repository = inject(ProductTagRepository);
				const service = new ProductTagService();
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
				inject(ProductTagIndexedDBDataProvider),
			),
		},

	]
})
export class ProductTagModule {
	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly productTagService = inject(ProductTagService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.productTag = this.productTagService;
	}

}
