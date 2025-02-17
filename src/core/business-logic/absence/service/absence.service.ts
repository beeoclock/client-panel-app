import {Injectable} from "@angular/core";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {BaseService} from "@core/shared/service/base.service";

type ENTITY = IAbsence.Entity;

@Injectable()
export class AbsenceService extends BaseService<ENTITY> {

	/**
	 * Find all absences by range
	 * @param start
	 * @param end
	 */
	public async findByRange(start: string, end: string) {
		// TODO take only state === 'active'
		return this.db.filter(record =>
			(record.start >= start && record.start < end) ||
			(record.end > start && record.end <= end) ||
			(record.start < start && record.end > end)
		).toArray();
	}
}
