import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@tenant/product/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import EProduct from "@tenant/product/domain/entity/e.product";
import {IProduct} from "@tenant/product/domain";
import {ProductRepository} from "@tenant/product/infrastructure/repository/product.repository";

@Injectable()
export class SyncManager extends BaseSyncManager<IProduct.DTO, EProduct> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(ProductRepository);
	protected readonly toEntity = EProduct.fromDTO;

	public constructor() {
		super('product');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
