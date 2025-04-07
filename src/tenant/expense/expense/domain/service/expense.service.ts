import {BaseService} from "@core/shared/service/base.service";
import {IExpense} from "@tenant/expense/expense/domain";

type ENTITY_RAW = IExpense.EntityRaw;

export class ExpenseService extends BaseService<ENTITY_RAW> {


}
