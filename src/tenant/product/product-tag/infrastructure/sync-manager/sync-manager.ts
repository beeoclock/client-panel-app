import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@tenant/product/product-tag/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IProductTag} from "@tenant/product/product-tag/domain";
import EProductTag from "@tenant/product/product-tag/domain/entity/e.product-tag";
import {ProductTagRepository} from "@tenant/product/product-tag/infrastructure/repository/product-tag.repository";

@Injectable()
export class SyncManager extends BaseSyncManager<IProductTag.DTO, EProductTag> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(ProductTagRepository);
	protected readonly toEntity = EProductTag.fromDTO;

	public constructor() {
		super('product-tag');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
