import {RIBaseEntity} from "@utility/domain";

export interface RIMember extends RIBaseEntity<'Member'> {
	firstName: string;
	secondName: string;
	lastName: string;
	email: string;
	phone: string;
}

export type ListMember = RIMember[];
export type IMember = Partial<RIMember>;
