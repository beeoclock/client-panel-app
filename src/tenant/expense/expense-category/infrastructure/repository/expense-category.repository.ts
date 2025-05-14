import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EExpenseCategory from "@tenant/expense/expense-category/domain/entity/e.expense-category";

@Injectable()
export class ExpenseCategoryRepository extends BaseRepository<EExpenseCategory> {

}
