import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";

export namespace IRole {

	export interface DTO extends IBaseDTO<'RoleDto'> {
		_version: string;
		name: string;
		isOwner: boolean;
		permissions: Permission[];
	}

	export interface Permission {
		code: number;
		scope: string;
	}

	export type EntityRaw = IBaseEntityRaw<'RoleDto'> & DTO & {

	};

}

export const isRole = Tools.createIs<IRole.DTO>();
export const validRole = Tools.createValidate<IRole.DTO>();
export const randomRole = Tools.createRandom<IRole.DTO>();
