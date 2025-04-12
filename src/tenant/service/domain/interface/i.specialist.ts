import {IMember} from "@tenant/member/member/domain/interface/i.member";

export interface ISpecialist {
	object: 'SpecialistDto';
	member: IMember.DTO;
	wasSelectedAnybody: boolean;
}
