import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EService from "@core/business-logic/service/entity/e.service";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EService> {

}
