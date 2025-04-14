import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import ECustomer from "@tenant/customer/domain/entity/e.customer";

@Injectable()
export class PluginRepository extends BaseRepository<ECustomer> {

}
