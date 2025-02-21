import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import ECustomer from "@core/business-logic/customer/entity/e.customer";

@Injectable()
export class CustomerRepository extends BaseRepository<ECustomer> {

}
