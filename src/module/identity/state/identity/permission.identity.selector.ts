import {createPropertySelectors, createSelector, Selector} from '@ngxs/store';
import {
	BeeoclockIdTokenResult,
	BeeoclockParsedToken,
	IdentityState,
	IIdentityState
} from "@identity/state/identity/identity.state";
import {IDetailedPermissions} from "@identity/domain/interface/i.member-permission";
import {MemberPermissionLevel} from "@identity/domain/enum/member-permission-level.enum";

export class PermissionIdentitySelector {
	static readonly state = createPropertySelectors<IIdentityState>(IdentityState);

	@Selector([PermissionIdentitySelector.state.token])
	public static memberPermissions(token: BeeoclockIdTokenResult) {
		return token?.claims?.memberPermissions;
	}

	@Selector([PermissionIdentitySelector.memberPermissions])
	public static permissions(memberPermissions: BeeoclockParsedToken['memberPermissions']) {
		return memberPermissions?.permissions;
	}

	@Selector([PermissionIdentitySelector.permissions])
	public static hasAllPermissions(permissions: IDetailedPermissions | 'all') {
		return permissions === 'all';
	}

	/**
	 * Check if the user has the permission to perform the action
	 * @param module
	 * @param action
	 * @param permissionLevels
	 */
	public static hasPermission(module: keyof IDetailedPermissions, action: keyof IDetailedPermissions, permissionLevels?: MemberPermissionLevel[]) {
		return createSelector([PermissionIdentitySelector.permissions], (permissions: IDetailedPermissions | 'all') => {
			if (permissions === 'all') {
				return true;
			}

			const modulePermissions = permissions[module];

			if (!modulePermissions) {
				return false;
			}

			if (!permissionLevels) {
				return true;
			}

			return permissionLevels.includes(modulePermissions[action]);
		});
	}

}
