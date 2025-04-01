import {BaseService} from "@core/shared/service/base.service";
import {IProduct} from "@tenant/product/domain";

type ENTITY_RAW = IProduct.EntityRaw;

export class ProductService extends BaseService<ENTITY_RAW> {


}
