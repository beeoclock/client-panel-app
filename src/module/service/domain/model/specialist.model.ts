import {ISpecialist} from "@service/domain/interface/i.specialist";
import {IMember} from "@src/module/member/domain";

export class SpecialistModel implements ISpecialist {

    public object: "SpecialistDto" = "SpecialistDto";
    public member!: Required<IMember>;
    public wasSelectedAnybody: boolean = false;

	public static create(initValue: Partial<ISpecialist> = {}): SpecialistModel {

		const model = new SpecialistModel();

		Object.assign(model, initValue);

		return model;

	}

}
