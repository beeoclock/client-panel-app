import {RoleEnum} from "@utility/domain/enum/role.enum";
import {Tools} from "@utility/tools";
import {Types} from "@utility/types";

export interface IBaseEntity<OBJECT_TYPE extends string> {

	// Added by the system
	_id: string & Types.ObjectId;
	createdAt: string & Types.DateTime;
	updatedAt: string & Types.DateTime;
	object: OBJECT_TYPE;

}

export type RIBaseEntity<OBJECT_TYPE extends string> = Required<IBaseEntity<OBJECT_TYPE>>;


export type IMeta = {
	history: (IHistory | IHistoryV2)[];
}

export const isIMeta = Tools.createIs<IMeta>();
export const validIMeta = Tools.createValidate<IMeta>();
export const randomIMeta = Tools.createRandom<IMeta>();

export type IHistory = {
	issuerId: string;
	issuerRole: RoleEnum;
	reason: string;
	value: string; // JSON
}

export const isIHistory = Tools.createIs<IHistory>();
export const validIHistory = Tools.createValidate<IHistory>();
export const randomIHistory = Tools.createRandom<IHistory>();

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

export const isIHistoryV2 = Tools.createIs<IHistoryV2>();
export const validIHistoryV2 = Tools.createValidate<IHistoryV2>();
export const randomIHistoryV2 = Tools.createRandom<IHistoryV2>();
