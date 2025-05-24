import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EExpense from "@tenant/expense/expense/domain/entity/e.expense";

@Injectable()
export class ExpenseRepository extends BaseRepository<EExpense> {

}
