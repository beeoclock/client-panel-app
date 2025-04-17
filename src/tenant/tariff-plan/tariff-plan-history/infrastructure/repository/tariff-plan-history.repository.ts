import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import ETariffPlanHistory from "@tenant/tariff-plan/tariff-plan-history/domain/entity/e.tariff-plan-history";

@Injectable()
export class TariffPlanHistoryRepository extends BaseRepository<ETariffPlanHistory> {

}
