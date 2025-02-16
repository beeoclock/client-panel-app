import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {ICustomer} from "@core/business-logic/customer";

@Injectable()
export class CustomerRepository extends BaseRepository<ICustomer.Entity> {

}
