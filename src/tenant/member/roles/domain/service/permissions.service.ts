import {ModulePermissionEnum, PermissionScopeEnum, IScopedPermission} from "../interface/i.role";

export interface IPermissionGroup {
	module: string;
	label: string;
	permissions: IPermissionItem[];
}

export interface IPermissionItem {
	code: ModulePermissionEnum;
	label: string;
	description: string;
	scopes: PermissionScopeEnum[];
}

export class PermissionsService {
	
	private static readonly PERMISSION_GROUPS: IPermissionGroup[] = [
		{
			module: 'member',
			label: 'role.form.permissions.group.member.label',
			permissions: [
				{
					code: ModulePermissionEnum.CRUD_MEMBER,
					label: 'role.form.permissions.member.crud.label',
					description: 'role.form.permissions.member.crud.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.READ_MEMBER,
					label: 'role.form.permissions.member.read.label',
					description: 'role.form.permissions.member.read.description',
					scopes: [PermissionScopeEnum.OWN, PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.CREATE_MEMBER,
					label: 'role.form.permissions.member.create.label',
					description: 'role.form.permissions.member.create.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.EDIT_MEMBER,
					label: 'role.form.permissions.member.edit.label',
					description: 'role.form.permissions.member.edit.description',
					scopes: [PermissionScopeEnum.OWN, PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.DELETE_MEMBER,
					label: 'role.form.permissions.member.delete.label',
					description: 'role.form.permissions.member.delete.description',
					scopes: [PermissionScopeEnum.ANY]
				}
			]
		},
		{
			module: 'service',
			label: 'role.form.permissions.group.service.label',
			permissions: [
				{
					code: ModulePermissionEnum.CRUD_SERVICE,
					label: 'role.form.permissions.service.crud.label',
					description: 'role.form.permissions.service.crud.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.READ_SERVICE,
					label: 'role.form.permissions.service.read.label',
					description: 'role.form.permissions.service.read.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.CREATE_SERVICE,
					label: 'role.form.permissions.service.create.label',
					description: 'role.form.permissions.service.create.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.EDIT_SERVICE,
					label: 'role.form.permissions.service.edit.label',
					description: 'role.form.permissions.service.edit.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.DELETE_SERVICE,
					label: 'role.form.permissions.service.delete.label',
					description: 'role.form.permissions.service.delete.description',
					scopes: [PermissionScopeEnum.ANY]
				}
			]
		},
		{
			module: 'order',
			label: 'role.form.permissions.group.order.label',
			permissions: [
				{
					code: ModulePermissionEnum.CRUD_ORDER,
					label: 'role.form.permissions.order.crud.label',
					description: 'role.form.permissions.order.crud.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.READ_ORDER,
					label: 'role.form.permissions.order.read.label',
					description: 'role.form.permissions.order.read.description',
					scopes: [PermissionScopeEnum.OWN, PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.CREATE_ORDER,
					label: 'role.form.permissions.order.create.label',
					description: 'role.form.permissions.order.create.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.EDIT_ORDER,
					label: 'role.form.permissions.order.edit.label',
					description: 'role.form.permissions.order.edit.description',
					scopes: [PermissionScopeEnum.OWN, PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.DELETE_ORDER,
					label: 'role.form.permissions.order.delete.label',
					description: 'role.form.permissions.order.delete.description',
					scopes: [PermissionScopeEnum.OWN, PermissionScopeEnum.ANY]
				}
			]
		},
		{
			module: 'customer',
			label: 'role.form.permissions.group.customer.label',
			permissions: [
				{
					code: ModulePermissionEnum.CRUD_CUSTOMER,
					label: 'role.form.permissions.customer.crud.label',
					description: 'role.form.permissions.customer.crud.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.READ_CUSTOMER,
					label: 'role.form.permissions.customer.read.label',
					description: 'role.form.permissions.customer.read.description',
					scopes: [PermissionScopeEnum.OWN, PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.CREATE_CUSTOMER,
					label: 'role.form.permissions.customer.create.label',
					description: 'role.form.permissions.customer.create.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.EDIT_CUSTOMER,
					label: 'role.form.permissions.customer.edit.label',
					description: 'role.form.permissions.customer.edit.description',
					scopes: [PermissionScopeEnum.OWN, PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.DELETE_CUSTOMER,
					label: 'role.form.permissions.customer.delete.label',
					description: 'role.form.permissions.customer.delete.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.FIND_CUSTOMER,
					label: 'role.form.permissions.customer.find.label',
					description: 'role.form.permissions.customer.find.description',
					scopes: [PermissionScopeEnum.ANY]
				}
			]
		},
		{
			module: 'absence',
			label: 'role.form.permissions.group.absence.label',
			permissions: [
				{
					code: ModulePermissionEnum.CRUD_ABSENCE,
					label: 'role.form.permissions.absence.crud.label',
					description: 'role.form.permissions.absence.crud.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.READ_ABSENCE,
					label: 'role.form.permissions.absence.read.label',
					description: 'role.form.permissions.absence.read.description',
					scopes: [PermissionScopeEnum.OWN, PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.CREATE_ABSENCE,
					label: 'role.form.permissions.absence.create.label',
					description: 'role.form.permissions.absence.create.description',
					scopes: [PermissionScopeEnum.OWN, PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.EDIT_ABSENCE,
					label: 'role.form.permissions.absence.edit.label',
					description: 'role.form.permissions.absence.edit.description',
					scopes: [PermissionScopeEnum.OWN, PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.DELETE_ABSENCE,
					label: 'role.form.permissions.absence.delete.label',
					description: 'role.form.permissions.absence.delete.description',
					scopes: [PermissionScopeEnum.OWN, PermissionScopeEnum.ANY]
				}
			]
		},
		{
			module: 'role',
			label: 'role.form.permissions.group.role.label',
			permissions: [
				{
					code: ModulePermissionEnum.CRUD_ROLE,
					label: 'role.form.permissions.role.crud.label',
					description: 'role.form.permissions.role.crud.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.READ_ROLE,
					label: 'role.form.permissions.role.read.label',
					description: 'role.form.permissions.role.read.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.CREATE_ROLE,
					label: 'role.form.permissions.role.create.label',
					description: 'role.form.permissions.role.create.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.EDIT_ROLE,
					label: 'role.form.permissions.role.edit.label',
					description: 'role.form.permissions.role.edit.description',
					scopes: [PermissionScopeEnum.ANY]
				},
				{
					code: ModulePermissionEnum.DELETE_ROLE,
					label: 'role.form.permissions.role.delete.label',
					description: 'role.form.permissions.role.delete.description',
					scopes: [PermissionScopeEnum.ANY]
				}
			]
		}
	];

	// Mapping of CRUD permissions to their child permissions
	private static readonly CRUD_CHILD_MAPPING: Partial<Record<ModulePermissionEnum, ModulePermissionEnum[]>> = {
		[ModulePermissionEnum.CRUD_MEMBER]: [
			ModulePermissionEnum.READ_MEMBER,
			ModulePermissionEnum.CREATE_MEMBER,
			ModulePermissionEnum.EDIT_MEMBER,
			ModulePermissionEnum.DELETE_MEMBER
		],
		[ModulePermissionEnum.CRUD_SERVICE]: [
			ModulePermissionEnum.READ_SERVICE,
			ModulePermissionEnum.CREATE_SERVICE,
			ModulePermissionEnum.EDIT_SERVICE,
			ModulePermissionEnum.DELETE_SERVICE
		],
		[ModulePermissionEnum.CRUD_ORDER]: [
			ModulePermissionEnum.READ_ORDER,
			ModulePermissionEnum.CREATE_ORDER,
			ModulePermissionEnum.EDIT_ORDER,
			ModulePermissionEnum.DELETE_ORDER
		],
		[ModulePermissionEnum.CRUD_CUSTOMER]: [
			ModulePermissionEnum.READ_CUSTOMER,
			ModulePermissionEnum.CREATE_CUSTOMER,
			ModulePermissionEnum.EDIT_CUSTOMER,
			ModulePermissionEnum.DELETE_CUSTOMER,
			ModulePermissionEnum.FIND_CUSTOMER
		],
		[ModulePermissionEnum.CRUD_ABSENCE]: [
			ModulePermissionEnum.READ_ABSENCE,
			ModulePermissionEnum.CREATE_ABSENCE,
			ModulePermissionEnum.EDIT_ABSENCE,
			ModulePermissionEnum.DELETE_ABSENCE
		],
		[ModulePermissionEnum.CRUD_ROLE]: [
			ModulePermissionEnum.READ_ROLE,
			ModulePermissionEnum.CREATE_ROLE,
			ModulePermissionEnum.EDIT_ROLE,
			ModulePermissionEnum.DELETE_ROLE
		]
	};

	public static getPermissionGroups(): IPermissionGroup[] {
		return this.PERMISSION_GROUPS;
	}

	public static getPermissionByCode(code: ModulePermissionEnum): IPermissionItem | undefined {
		for (const group of this.PERMISSION_GROUPS) {
			const permission = group.permissions.find(p => p.code === code);
			if (permission) {
				return permission;
			}
		}
		return undefined;
	}

	public static getScopeLabel(scope: PermissionScopeEnum): string {
		switch (scope) {
			case PermissionScopeEnum.OWN:
				return 'role.form.permissions.scope.own';
			case PermissionScopeEnum.ANY:
				return 'role.form.permissions.scope.any';
			default:
				return scope;
		}
	}

	public static hasPermission(
		userPermissions: IScopedPermission[],
		requiredPermission: ModulePermissionEnum,
		requiredScope: PermissionScopeEnum = PermissionScopeEnum.ANY
	): boolean {
		return userPermissions.some(permission => 
			permission.code === requiredPermission && 
			permission.scope === requiredScope
		);
	}

	// Get CRUD permission for a module
	public static getCrudPermissionForModule(module: string): ModulePermissionEnum | undefined {
		const group = this.PERMISSION_GROUPS.find(g => g.module === module);
		if (!group) return undefined;
		
		const crudPermission = group.permissions.find(p => 
			p.code.toString().startsWith('CRUD_')
		);
		return crudPermission?.code;
	}

	// Get child permissions for a CRUD permission
	public static getChildPermissions(crudPermission: ModulePermissionEnum): ModulePermissionEnum[] {
		return this.CRUD_CHILD_MAPPING[crudPermission] || [];
	}

	// Check if a permission is a CRUD permission
	public static isCrudPermission(permission: ModulePermissionEnum): boolean {
		return permission.toString().startsWith('CRUD_');
	}

	// Get all permissions for a module
	public static getModulePermissions(module: string): IPermissionItem[] {
		const group = this.PERMISSION_GROUPS.find(g => g.module === module);
		return group?.permissions || [];
	}
} 