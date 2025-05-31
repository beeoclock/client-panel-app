import {BaseService} from "@core/shared/service/base.service";
import {IProductTag} from "@tenant/product/product-tag/domain";

type ENTITY_RAW = IProductTag.EntityRaw;

export class ProductTagService extends BaseService<ENTITY_RAW> {

	public findByName(name: string): Promise<IProductTag.DTO | null> {
		return this.repository.findAsync({name}).then(({items}) => {
			if (items.length > 0) {
				return items[0];
			}
			return null;
		});
	}

}
