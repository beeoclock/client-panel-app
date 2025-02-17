import {IMember} from "@core/business-logic/member/interface/i.member";

export interface ISpecialist {
	object: 'SpecialistDto';
	member: IMember.DTO;
	wasSelectedAnybody: boolean;
}
