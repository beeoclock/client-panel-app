import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";

@Injectable()
export class AbsenceTableService extends TableService<IAbsenceDto> {
	public override readonly actions = AbsenceActions;
}
