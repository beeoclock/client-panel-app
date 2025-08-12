import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/product/product/infrastructure/data-provider/api.data-provider";
import {SyncManager} from "@tenant/product/product/infrastructure/sync-manager/sync-manager";
import {NgxsModule} from "@ngxs/store";
import {PushChangesSyncManager} from "@tenant/product/product/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	CreateProductApiAdapter
} from "@tenant/product/product/infrastructure/data-source/api/create.product.api.adapter";
import {
	DeleteProductApiAdapter
} from "@tenant/product/product/infrastructure/data-source/api/delete.product.api.adapter";
import {ItemProductApiAdapter} from "@tenant/product/product/infrastructure/data-source/api/item.product.api.adapter";
import {
	UpdateProductApiAdapter
} from "@tenant/product/product/infrastructure/data-source/api/update.product.api.adapter";
import {
	ProductIndexedDBDataProvider
} from "@tenant/product/product/infrastructure/data-provider/indexedDB/product.indexedDB.data-provider";
import {
	ProductDexieAdapterIndexedDBDataProvider
} from "@tenant/product/product/infrastructure/data-provider/indexedDB/adapter/product.dexie.adapter.indexedDB.data-provider";
import {ProductRepository} from "@tenant/product/product/infrastructure/repository/product.repository";
import {ProductService} from "@tenant/product/product/domain/service/product.service";
import {ListProductApiAdapter} from "@tenant/product/product/infrastructure/data-source/api/list.product.api.adapter";
import {
	ProductPresentationState
} from "@tenant/product/product/infrastructure/state/presentation/product.presentation.state";
import {ProductDataState} from "@tenant/product/product/infrastructure/state/data/product.data.state";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			ProductDataState,
			ProductPresentationState,
		]),
	],
	providers: [

		// Api
		CreateProductApiAdapter,
		DeleteProductApiAdapter,
		ItemProductApiAdapter,
		UpdateProductApiAdapter,
		ListProductApiAdapter,

		// Data Provider
		ApiDataProvider,
		ProductIndexedDBDataProvider,

		// Adapter
		ProductDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: ProductRepository,
			useFactory: () => {
				const dataProvider = inject(ProductIndexedDBDataProvider);
				const repository = new ProductRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: ProductService,
			useFactory: () => {
				const repository = inject(ProductRepository);
				const service = new ProductService();
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
				inject(ProductIndexedDBDataProvider),
			),
		},

	]
})
export class ProductModule {
	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly productService = inject(ProductService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.product = this.productService;
	}

}
