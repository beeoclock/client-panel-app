import {RoleEnum} from "@core/shared/enum/role.enum";
import {Tools} from "@core/shared/tools";

export interface IOrderMetaDto {
	object: 'OrderMetaDto';
	history: IOrderHistoryEntryDto[];
}

export const isOrderMetaDto = Tools.createIs<IOrderMetaDto>();
export const validOrderMetaDto = Tools.createValidate<IOrderMetaDto>();
export const randomOrderMetaDto = Tools.createRandom<IOrderMetaDto>();

export interface IOrderHistoryEntryDto {
	object?: string;
	issuerRole: RoleEnum;
	issuerId: string;
	reason: string;
	value: string;
	createdAt?: string;
}

export const isOrderHistoryEntryDto = Tools.createIs<IOrderHistoryEntryDto>();
export const validOrderHistoryEntryDto = Tools.createValidate<IOrderHistoryEntryDto>();
export const randomOrderHistoryEntryDto = Tools.createRandom<IOrderHistoryEntryDto>();
