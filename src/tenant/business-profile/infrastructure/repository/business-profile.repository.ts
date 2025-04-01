import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EBusinessProfile from "@tenant/business-profile/domain/entity/e.business-profile";

@Injectable()
export class BusinessProfileRepository extends BaseRepository<EBusinessProfile> {

}
