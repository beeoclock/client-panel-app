import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";
import {AbsenceTypeEnum} from "@tenant/member/absence/domain/enums/absence.type.enum";
import {IMember} from "@tenant/member/member/domain/interface/i.member";


export class EAbsence extends ABaseEntity<'AbsenceDto', IAbsence.DTO, IAbsence.EntityRaw> implements IAbsence.EntityRaw {

	override object = 'AbsenceDto' as const;

	note!: string;
	start!: string;
	end!: string;
	type!: AbsenceTypeEnum;
	entireBusiness!: boolean;
	members!: Required<IMember.DTO>[];
	timeZone!: string;

	public override toDTO(): IAbsence.DTO {
		return EAbsence.toDTO(this);
	}

	public static toDTO(data: IAbsence.EntityRaw): IAbsence.DTO {
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
	public static fromDTO(data: IAbsence.DTO): EAbsence {
		return new EAbsence(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IAbsence.EntityRaw): EAbsence {
		return new EAbsence(data);
	}

}

export default EAbsence;
