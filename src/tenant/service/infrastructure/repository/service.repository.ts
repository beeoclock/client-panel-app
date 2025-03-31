import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EService from "@tenant/service/domain/entity/e.service";

@Injectable()
export class ServiceRepository extends BaseRepository<EService> {

}
