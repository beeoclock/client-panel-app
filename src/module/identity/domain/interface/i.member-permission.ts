import {MemberPermissionLevel} from '../enum/member-permission-level.enum';

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
