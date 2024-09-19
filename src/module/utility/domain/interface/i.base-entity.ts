import typia, {tags} from "typia";
import {RoleEnum} from "@utility/domain/enum/role.enum";

export interface IBaseEntity<OBJECT_TYPE extends string> {

	// Added by the system
	_id: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
	createdAt: string & tags.Format<'date-time'>;
	updatedAt: string & tags.Format<'date-time'>;
	object: OBJECT_TYPE;

}

export type RIBaseEntity<OBJECT_TYPE extends string> = Required<IBaseEntity<OBJECT_TYPE>>;


export type IMeta = {
	history: (IHistory | IHistoryV2)[];
}

export const isIMeta = typia.createIs<IMeta>();
export const validIMeta = typia.createValidate<IMeta>();
export const randomIMeta = typia.createRandom<IMeta>();

export type IHistory = {
	issuerId: string;
	issuerRole: RoleEnum;
	reason: string;
	value: string; // JSON
}

export const isIHistory = typia.createIs<IHistory>();
export const validIHistory = typia.createValidate<IHistory>();
export const randomIHistory = typia.createRandom<IHistory>();

export type IHistoryV2 = {
	issuer: {
		type: 'customer' | 'system' | 'member';
		ref: string; // id клієнта, системи або учасника
	};
	createdAt: string; // ISO
	value: string; // JSON
	reason: string; // причина
	_v: 2;
}

export const isIHistoryV2 = typia.createIs<IHistoryV2>();
export const validIHistoryV2 = typia.createValidate<IHistoryV2>();
export const randomIHistoryV2 = typia.createRandom<IHistoryV2>();
