import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EExpenseCategory from "@tenant/expense/expense-category/domain/entity/e.expense-category";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EExpenseCategory> {

}
