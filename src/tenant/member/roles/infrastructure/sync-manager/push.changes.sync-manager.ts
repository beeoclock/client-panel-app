import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import ERole from "@tenant/member/roles/domain/entity/e.role";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<ERole> {

}
