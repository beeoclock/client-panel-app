import {ABaseItem} from "@src/core/abstract/a.base-item";
import {IAbsence} from "@absence/domain/interface/i.absence";
import {IMember} from "@src/module/member/domain";
import {AbsenceTypeEnum} from "../enums/absence.type.enum";


export class EAbsence extends ABaseItem<'AbsenceDto', IAbsence.DTO> implements IAbsence.Entity {

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
		const {id, ...rest} = data;
		return rest;
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
