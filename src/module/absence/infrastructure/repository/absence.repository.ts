import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";

@Injectable()
export class AbsenceRepository extends BaseRepository<IAbsence.Entity> {

}
