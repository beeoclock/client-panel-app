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
			entireBusiness: data.entireBusiness,
			timeZone: data.timeZone,
			members: data.members,
			start: data.start,
			type: data.type,
			note: data.note,
			end: data.end,

			_id: data._id,
			state: data.state,
			object: data.object,
			_version: data._version,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			stateHistory: data.stateHistory,
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
