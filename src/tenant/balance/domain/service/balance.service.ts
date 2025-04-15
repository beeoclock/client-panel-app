import {BaseService} from "@core/shared/service/base.service";
import {IBalance} from "@tenant/balance/domain";

type ENTITY_RAW = IBalance.EntityRaw;

export class BalanceService extends BaseService<ENTITY_RAW> {


}
