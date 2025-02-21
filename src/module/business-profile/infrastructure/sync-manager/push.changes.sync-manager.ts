import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EBusinessProfile from "@core/business-logic/business-profile/entity/e.business-profile";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EBusinessProfile> {

}
