import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import {IService} from "@core/business-logic/service/interface/i.service";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<IService.Entity> {

}
