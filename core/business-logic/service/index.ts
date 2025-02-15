import {RIMember} from "../member";
import {ISpecialist} from "./interface/i.specialist";

export * from './interface';
export const Service = {
	memberToSpecialist: (member: RIMember): ISpecialist => {
		return {
			object: 'SpecialistDto',
			member: member,
			wasSelectedAnybody: false,
		};
	}
}
