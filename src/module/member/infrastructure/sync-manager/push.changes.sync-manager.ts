import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import {IMember} from "@core/business-logic/member/interface/i.member";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<IMember.Entity> {

}
