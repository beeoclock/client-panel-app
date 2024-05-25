import {RoleEnum} from "@utility/domain/enum/role.enum";
import typia from "typia";

export interface IOrderMetaDto {
	object: 'OrderMetaDto';
	history: IOrderHistoryEntryDto[];
}

export const isOrderMetaDto = typia.createIs<IOrderMetaDto>();
export const validOrderMetaDto = typia.createValidate<IOrderMetaDto>();
export const randomOrderMetaDto = typia.createRandom<IOrderMetaDto>();

export interface IOrderHistoryEntryDto {
	object?: string;
	issuerRole: RoleEnum;
	issuerId: string;
	reason: string;
	value: string;
	createdAt?: string;
}

export const isOrderHistoryEntryDto = typia.createIs<IOrderHistoryEntryDto>();
export const validOrderHistoryEntryDto = typia.createValidate<IOrderHistoryEntryDto>();
export const randomOrderHistoryEntryDto = typia.createRandom<IOrderHistoryEntryDto>();
