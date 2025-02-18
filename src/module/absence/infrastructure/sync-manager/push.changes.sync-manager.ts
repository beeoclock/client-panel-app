import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<IAbsence.Entity> {

}
