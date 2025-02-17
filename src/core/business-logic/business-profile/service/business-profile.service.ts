import {Injectable} from "@angular/core";
import {BaseService} from "@core/shared/service/base.service";
import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";

type ENTITY = IBusinessProfile.Entity;

@Injectable()
export class BusinessProfileService extends BaseService<ENTITY> {


}
