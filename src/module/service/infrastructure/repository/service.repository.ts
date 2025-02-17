import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {IService} from "@core/business-logic/service/interface/i.service";

@Injectable()
export class ServiceRepository extends BaseRepository<IService.Entity> {

}
