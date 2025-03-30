import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import ETariffPlan from "@tenant/tariff-plan/domain/entity/e.tariff-plan";

@Injectable()
export class TariffPlanRepository extends BaseRepository<ETariffPlan> {

}
