import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import {ICustomer} from "@core/business-logic/customer";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<ICustomer.Entity> {

}
