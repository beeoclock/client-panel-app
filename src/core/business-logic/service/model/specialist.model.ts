import {ISpecialist} from "../interface/i.specialist";
import {RIMember} from "../../member";

export class SpecialistModel implements ISpecialist {

	public object = "SpecialistDto" as const;
	public member!: RIMember;
	public wasSelectedAnybody: boolean = false;

	public static create(initValue: Partial<ISpecialist> = {}): SpecialistModel {

		const model = new SpecialistModel();

		Object.assign(model, initValue);

		return model;

	}

}
