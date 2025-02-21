import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EMember from "@core/business-logic/member/entity/e.member";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EMember> {

}
