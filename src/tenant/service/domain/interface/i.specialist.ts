import {IMember} from "@tenant/member/domain/interface/i.member";

export interface ISpecialist {
	object: 'SpecialistDto';
	member: IMember.DTO;
	wasSelectedAnybody: boolean;
}
