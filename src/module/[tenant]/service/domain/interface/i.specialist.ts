import {RIMember} from "@member/domain";

export interface ISpecialist {
	object: 'SpecialistDto';
	member: RIMember;
	wasSelectedAnybody: boolean;
}
