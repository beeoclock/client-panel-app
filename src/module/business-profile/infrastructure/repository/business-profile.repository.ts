import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";

@Injectable()
export class BusinessProfileRepository extends BaseRepository<IBusinessProfile.Entity> {

}
