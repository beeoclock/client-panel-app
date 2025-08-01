import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";

export enum ModulePermissionEnum {
	CRUD_MEMBER = 1000,
	READ_MEMBER = 1001,
	CREATE_MEMBER = 1002,
	EDIT_MEMBER = 1003,
	DELETE_MEMBER = 1004,

	CRUD_SERVICE = 2000,
	READ_SERVICE = 2001,
	CREATE_SERVICE = 2002,
	EDIT_SERVICE = 2003,
	DELETE_SERVICE = 2004,

	CRUD_ORDER = 3000,
	READ_ORDER = 3001,
	CREATE_ORDER = 3002,
	EDIT_ORDER = 3003,
	DELETE_ORDER = 3004,

	CRUD_ORDER_SERVICE = 4000,
	READ_ORDER_SERVICE = 4001,
	CREATE_ORDER_SERVICE = 4002,
	EDIT_ORDER_SERVICE = 4003,
	DELETE_ORDER_SERVICE = 4004,

	CRUD_CUSTOMER = 5000,
	READ_CUSTOMER = 5001,
	CREATE_CUSTOMER = 5002,
	EDIT_CUSTOMER = 5003,
	DELETE_CUSTOMER = 5004,
	FIND_CUSTOMER = 5005,

	CRUD_ABSENCE = 6000,
	READ_ABSENCE = 6001,
	CREATE_ABSENCE = 6002,
	EDIT_ABSENCE = 6003,
	DELETE_ABSENCE = 6004,

	CRUD_TARIF = 7000,
	READ_TARIF = 7001,
	CREATE_TARIF = 7002,
	EDIT_TARIF = 7003,
	DELETE_TARIF = 7004,

	CRUD_BUSINESS_PROFILE = 8000,
	READ_BUSINESS_PROFILE = 8001,
	CREATE_BUSINESS_PROFILE = 8002,
	EDIT_BUSINESS_PROFILE = 8003,
	DELETE_BUSINESS_PROFILE = 8004,
 
	CRUD_ROLE = 9000,
	READ_ROLE = 9001,
	CREATE_ROLE = 9002,
	EDIT_ROLE = 9003,
	DELETE_ROLE = 9004,
}

export enum PermissionScopeEnum {
	OWN = 'own',
	ANY = 'any'
}

export interface IScopedPermission {
	code: ModulePermissionEnum;
	scope: PermissionScopeEnum;
}

export namespace IRole {

	export interface DTO extends IBaseDTO<'RoleDto'> {
		_version: string;
		name: string;
		isOwner: boolean;
		permissions: IScopedPermission[];
	}

	export interface Permission extends IScopedPermission {
		// Legacy interface for backward compatibility
	}

	export type EntityRaw = IBaseEntityRaw<'RoleDto'> & DTO & {

	};

}

export const isRole = Tools.createIs<IRole.DTO>();
export const validRole = Tools.createValidate<IRole.DTO>();
export const randomRole = Tools.createRandom<IRole.DTO>();
