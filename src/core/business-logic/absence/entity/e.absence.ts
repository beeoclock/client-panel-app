import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {IMember} from "@core/business-logic/member";
import {AbsenceTypeEnum} from "@core/business-logic/absence/enums/absence.type.enum";


export class EAbsence extends ABaseEntity<'AbsenceDto', IAbsence.DTO> implements IAbsence.Entity {

	note!: string;
	start!: string;
	end!: string;
	type!: AbsenceTypeEnum;
	entireBusiness!: boolean;
	members!: Required<IMember>[];
	timeZone!: string;

	public override toDTO(): IAbsence.DTO {
		return EAbsence.toDTO(this);
	}

	public static toDTO(data: IAbsence.Entity): IAbsence.DTO {
		return {
			_id: data._id,
			createdAt: data.createdAt,
			end: data.end,
			entireBusiness: data.entireBusiness,
			members: data.members,
			note: data.note,
			object: data.object,
			start: data.start,
			state: data.state,
			stateHistory: data.stateHistory,
			timeZone: data.timeZone,
			type: data.type,
			updatedAt: data.updatedAt,
		};
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static create(data: IAbsence.DTO): IAbsence.Entity {
		return new EAbsence(data);
	}

}

export default EAbsence;
