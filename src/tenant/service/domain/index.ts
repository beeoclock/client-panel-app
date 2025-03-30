import {ISpecialist} from "./interface/i.specialist";
import {IMember} from "@tenant/member/domain/interface/i.member";

export * from './interface';
export const Service = {
	memberToSpecialist: (member: IMember.DTO): ISpecialist => {
		return {
			object: 'SpecialistDto',
			member: member,
			wasSelectedAnybody: false,
		};
	}
}
