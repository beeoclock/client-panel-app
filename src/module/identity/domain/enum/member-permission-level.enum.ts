export enum MemberPermissionLevel {
  any = 'any',
  my = 'my',
}

export const PERMISSION_LEVEL_ME = [MemberPermissionLevel.my];
export const PERMISSION_LEVEL_ANY = [MemberPermissionLevel.any, MemberPermissionLevel.my];
export const PERMISSION_LEVEL_AT_LEAST_ONE = [MemberPermissionLevel.any, MemberPermissionLevel.my];
