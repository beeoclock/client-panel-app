import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EProduct from "@tenant/product/domain/entity/e.product";

@Injectable()
export class ProductRepository extends BaseRepository<EProduct> {

}
