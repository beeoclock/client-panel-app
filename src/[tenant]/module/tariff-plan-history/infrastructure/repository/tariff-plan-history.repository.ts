import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import ETariffPlanHistory from "@core/business-logic/tariif-plan-history/entity/e.tariff-plan-history";

@Injectable()
export class TariffPlanHistoryRepository extends BaseRepository<ETariffPlanHistory> {

}
