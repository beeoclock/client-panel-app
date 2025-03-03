import {Injectable} from "@angular/core";
import {BaseService} from "@core/shared/service/base.service";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";

type ENTITY_RAW = ITariffPlan.EntityRaw;

@Injectable()
export class TariffPlanService extends BaseService<ENTITY_RAW> {

}
