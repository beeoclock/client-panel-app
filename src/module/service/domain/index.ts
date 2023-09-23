import {IMember} from "@member/domain";
import {ISpecialist} from "@service/domain/interface/i.specialist";

export * from './interface';
export const Service = {
	memberToSpecialist: (member: IMember): ISpecialist => {
		return {
			object: 'Specialist',
			member: member
		};
	}
}
