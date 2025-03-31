import {BaseService} from "@core/shared/service/base.service";
import {IBusinessProfile} from "@tenant/business-profile/domain/interface/i.business-profile";

type ENTITY_RAW = IBusinessProfile.EntityRaw;

export class BusinessProfileService extends BaseService<ENTITY_RAW> {


}
