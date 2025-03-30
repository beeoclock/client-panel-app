import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EAbsence from "@tenant/absence/domain/entity/e.absence";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EAbsence> {

}
