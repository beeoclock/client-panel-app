import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EProductTag from "@tenant/product-tag/domain/entity/e.product-tag";

@Injectable()
export class ProductTagRepository extends BaseRepository<EProductTag> {

}
