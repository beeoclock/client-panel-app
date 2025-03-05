import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EService from "@core/business-logic/service/entity/e.service";

@Injectable()
export class ServiceRepository extends BaseRepository<EService> {

}
