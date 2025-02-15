import {RIMember} from "../../member";

export interface ISpecialist {
	object: 'SpecialistDto';
	member: RIMember;
	wasSelectedAnybody: boolean;
}
