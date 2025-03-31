import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EAbsence from "@tenant/absence/domain/entity/e.absence";

@Injectable()
export class AbsenceRepository extends BaseRepository<EAbsence> {

}
