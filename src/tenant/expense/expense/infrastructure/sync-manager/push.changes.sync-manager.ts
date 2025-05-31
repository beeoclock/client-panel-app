import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EExpense from "@tenant/expense/expense/domain/entity/e.expense";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EExpense> {

}
