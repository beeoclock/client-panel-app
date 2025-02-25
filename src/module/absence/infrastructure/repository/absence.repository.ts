import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EAbsence from "@core/business-logic/absence/entity/e.absence";

@Injectable()
export class AbsenceRepository extends BaseRepository<EAbsence> {

}
