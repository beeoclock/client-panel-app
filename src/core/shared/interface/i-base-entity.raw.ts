import {RoleEnum} from "@core/shared/enum/role.enum";
import {Tools} from "@core/shared/tools";
import {Types} from "@core/shared/types";
import {StateEnum} from "@core/shared/enum/state.enum";

export interface IBaseDTO<OBJECT_TYPE> {

	// Added by the system
	_id: string & Types.ObjectId;
	createdAt: string & Types.DateTime;
	updatedAt: string & Types.DateTime;
	object: OBJECT_TYPE;
	state: StateEnum;
	_version: string;

	stateHistory: {
		state: StateEnum;
		setAt: string & Types.DateTime;
	}[];

}

/**
 * Base entity raw
 * Does not contain any methods, only properties
 */
export interface IBaseEntityRaw<OBJECT_TYPE> extends IBaseDTO<OBJECT_TYPE> {

	syncedAt?: string & Types.DateTime;
	errors?: {
		fromSource: 'server' | 'client';
		message: string;
		code?: number;
	}[];

}


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
