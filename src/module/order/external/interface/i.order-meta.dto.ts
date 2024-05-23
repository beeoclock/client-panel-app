import {RoleEnum} from "@utility/domain/enum/role.enum";

export interface IOrderMetaDto {
	object?: 'OrderMetaDto';
	history: IOrderHistoryEntryDto[];
}

export interface IOrderHistoryEntryDto {
	object?: string;
	issuerRole: RoleEnum;
	issuerId: string;
	reason: string;
	value: string;
	createdAt?: string;
}
