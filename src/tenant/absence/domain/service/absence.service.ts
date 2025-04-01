import {IAbsence} from "@tenant/absence/domain/interface/i.absence";
import {BaseService} from "@core/shared/service/base.service";
import {StateEnum} from "@core/shared/enum/state.enum";

type ENTITY_RAW = IAbsence.EntityRaw;

export class AbsenceService extends BaseService<ENTITY_RAW> {

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
