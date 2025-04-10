import {BaseService} from "@core/shared/service/base.service";
import {ITariffPlan} from "@tenant/tariff-plan/tariff-plan/domain/interface/i.tariff-plan";

type ENTITY_RAW = ITariffPlan.EntityRaw;

export class TariffPlanService extends BaseService<ENTITY_RAW> {

}
