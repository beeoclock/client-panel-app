import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EBusinessProfile from "@core/business-logic/business-profile/entity/e.business-profile";

@Injectable()
export class BusinessProfileRepository extends BaseRepository<EBusinessProfile> {

}
