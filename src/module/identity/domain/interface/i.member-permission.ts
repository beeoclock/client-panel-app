import {MemberPermissionLevel} from '../enum/member-permission-level.enum';

type NestedKeys<T> = {
	[K in keyof T]: T[K] extends object ? keyof T[K] : never;
}[keyof T];

export interface IDetailedPermissions {
    event?: {
        read?: MemberPermissionLevel;
        create?: MemberPermissionLevel;
        update?: MemberPermissionLevel;
        delete?: MemberPermissionLevel;
    };
    member?: {
        read?: MemberPermissionLevel;
        create?: MemberPermissionLevel;
        update?: MemberPermissionLevel;
        delete?: MemberPermissionLevel;
    };
    customer?: {
        read?: MemberPermissionLevel;
        create?: MemberPermissionLevel;
        update?: MemberPermissionLevel;
        delete?: MemberPermissionLevel;
    };
    service?: {
        read?: MemberPermissionLevel;
        create?: MemberPermissionLevel;
        update?: MemberPermissionLevel;
        delete?: MemberPermissionLevel;
    };
    businessProfileSettings?: {
        read?: MemberPermissionLevel;
        create?: MemberPermissionLevel;
        update?: MemberPermissionLevel;
        delete?: MemberPermissionLevel;
    };
    businessSetting?: {
        read?: MemberPermissionLevel;
        create?: MemberPermissionLevel;
        update?: MemberPermissionLevel;
        delete?: MemberPermissionLevel;
    };
}

export type PermissionKeys = NestedKeys<Required<IDetailedPermissions>>;
