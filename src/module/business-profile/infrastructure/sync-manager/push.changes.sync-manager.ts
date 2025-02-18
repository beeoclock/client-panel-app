import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<IBusinessProfile.Entity> {

}
