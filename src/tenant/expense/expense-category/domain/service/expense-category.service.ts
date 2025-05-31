import {BaseService} from "@core/shared/service/base.service";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";

type ENTITY_RAW = IExpenseCategory.EntityRaw;

export class ExpenseCategoryService extends BaseService<ENTITY_RAW> {


}
