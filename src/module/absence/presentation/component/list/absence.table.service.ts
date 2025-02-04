import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {IAbsence} from "@absence/domain/interface/i.absence";

@Injectable()
export class AbsenceTableService extends TableService<IAbsence.DTO> {
	public override readonly actions = AbsenceActions;
}
