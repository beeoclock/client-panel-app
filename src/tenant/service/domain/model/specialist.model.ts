import {ISpecialist} from "../interface/i.specialist";
import {IMember} from "@tenant/member/domain/interface/i.member";

export class SpecialistModel implements ISpecialist {

	public object = "SpecialistDto" as const;
	public member!: IMember.DTO;
	public wasSelectedAnybody: boolean = false;

	public static create(initValue: Partial<ISpecialist> = {}): SpecialistModel {

		const model = new SpecialistModel();

		Object.assign(model, initValue);

		return model;

	}

}
