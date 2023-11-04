import {RIBaseEntity} from "@utility/domain";

export interface IMember extends RIBaseEntity<'Member'> {
	firstName?: string;
	secondName?: string; // Deprecated
	lastName?: string;
	email: string;
	phone?: string;
}

export type RIMember = Required<IMember>
export type ListMember = RIMember[];
export type PIMember = Partial<RIMember>;
