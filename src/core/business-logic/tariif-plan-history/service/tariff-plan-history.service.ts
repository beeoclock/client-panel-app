import {Injectable} from "@angular/core";
import {BaseService} from "@core/shared/service/base.service";
import {ITariffPlanHistory} from "@core/business-logic/tariif-plan-history/interface/i.tariff-plan";

type ENTITY_RAW = ITariffPlanHistory.EntityRaw;

@Injectable()
export class TariffPlanHistoryService extends BaseService<ENTITY_RAW> {

}
