import {Injectable} from "@angular/core";
import {IService} from "@core/business-logic/service/interface/i.service";
import {BaseService} from "@core/shared/service/base.service";

type ENTITY = IService.EntityRaw;

@Injectable()
export class ServiceService extends BaseService<ENTITY> {

}
