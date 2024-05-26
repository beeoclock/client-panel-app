import {RIMember} from "@member/domain";
import {ISpecialist} from "@service/domain/interface/i.specialist";

export * from './interface';
export const Service = {
	memberToSpecialist: (member: RIMember): ISpecialist => {
		return {
			object: 'SpecialistDto',
			member: member
		};
	}
}
