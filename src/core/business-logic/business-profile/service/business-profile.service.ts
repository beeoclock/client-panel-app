import {Injectable} from "@angular/core";
import {BaseService} from "@core/shared/service/base.service";
import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";

type ENTITY_RAW = IBusinessProfile.EntityRaw;

@Injectable()
export class BusinessProfileService extends BaseService<ENTITY_RAW> {


}
