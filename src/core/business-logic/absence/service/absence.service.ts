import {Injectable} from "@angular/core";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {BaseService} from "@core/shared/service/base.service";
import {StateEnum} from "@core/shared/enum/state.enum";

type ENTITY = IAbsence.Entity;

@Injectable()
export class AbsenceService extends BaseService<ENTITY> {

	/**
	 * Find all absences by range
	 * @param start
	 * @param end
	 * @param states
	 */
	public async findByRange(start: string, end: string, states: StateEnum[] = [StateEnum.active]) {
		return this.db.filter(record =>
			(
				states.includes(record.state)
			) && (
				(record.start >= start && record.start < end) ||
				(record.end > start && record.end <= end) ||
				(record.start < start && record.end > end)
			)
		).toArray();
	}
}
